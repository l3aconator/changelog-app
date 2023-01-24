import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Layout from "components/Layout";
import Input from "components/Input";
import Toggle from "components/Toggle";
import Button from "components/Button";

type Field = {
  id: string;
  slug: string;
  name: string;
};

type Integration = {
  name: string;
  is_active: boolean;
  webflow_integrations: {
    site_id: string;
    collection_id: string;
    id: string;
    field_mappings: Array<[string, Field]>;
  };
};

export default function OrgHome() {
  const baseFormState = {
    name: "",
    is_active: false,
    webflow_integrations: {
      site_id: "",
      collection_id: "",
      id: "",
      field_mappings: [],
    },
  } as Integration;
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [integration, setIntegration] = useState(baseFormState);

  useEffect(() => {
    async function getIntegration() {
      try {
        setLoading(true);

        let { data, error, status } = await supabase
          .from("organization_integrations")
          .select(
            `
            name,
            is_active,
            webflow_integrations (
              *
            )`
          )
          .eq("id", router.query.orgIntegrationId)
          .eq("organization_id", router.query.orgId)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setIntegration(data);
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (router.query.orgIntegrationId) {
      getIntegration();
    }
  }, [router, supabase]);

  useEffect(() => {
    async function getCollection() {
      try {
        const response = await fetch(
          `/api/${router.query.orgId}/adapters/webflow-search?type=get-collection&site_id=${integration.webflow_integrations.site_id}&collection_id=${integration.webflow_integrations.collection_id}`
        );
        const { collectionFields } = await response.json();

        if (response) {
          const finalFields = collectionFields.map((field: Field) => [
            "",
            field,
          ]);

          setIntegration({
            ...integration,
            webflow_integrations: {
              ...integration.webflow_integrations,
              field_mappings: finalFields,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (
      (integration?.webflow_integrations?.site_id &&
        integration?.webflow_integrations?.field_mappings?.length === 0) ||
      !integration?.webflow_integrations?.field_mappings
    ) {
      getCollection();
    }
  }, [integration, router, supabase]);

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    setIntegration({ ...integration, [e.target.name]: e.target.value });
  }

  function handleNestedChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    setIntegration({
      ...integration,
      webflow_integrations: {
        ...integration.webflow_integrations,
        [e.target.name]: e.target.value,
      },
    });
  }

  function handleChecked(e: React.ChangeEvent<HTMLInputElement>) {
    setIntegration({ ...integration, [e.target.name]: !integration.is_active });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { name, is_active, webflow_integrations } = integration;

    try {
      let { data: integrationData, error: integrationError } = await supabase
        .from("webflow_integrations")
        .update({
          site_id: webflow_integrations.site_id,
          collection_id: webflow_integrations.collection_id,
          field_mappings: webflow_integrations.field_mappings,
        })
        .eq("id", webflow_integrations.id);

      let { data, error, status } = await supabase
        .from("organization_integrations")
        .update({
          name,
          is_active,
        })
        .eq("organization_id", router.query.orgId)
        .eq("id", router.query.orgIntegrationId)
        .select(
          `
            name,
            is_active,
            webflow_integrations (
              *
            )`
        )
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setIntegration(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      let { error, status } = await supabase
        .from("organization_integrations")
        .delete()
        .eq("organization_id", router.query.orgId)
        .eq("id", router.query.orgIntegrationId);

      await fetch(
        `/api/${router.query.orgId}/adapters/webflow-remove?site_id=${integration.webflow_integrations.site_id}`
      );

      await supabase
        .from("webflow_integrations")
        .delete()
        .eq("id", integration.webflow_integrations.id);

      if (error && status !== 406) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    } finally {
      router.push(`/organization/${router.query.orgId}/integrations`);
    }
  }

  function handleMapping(
    e: React.ChangeEvent<HTMLSelectElement>,
    name: string,
    slug: string,
    id: string,
    index: number
  ) {
    const field_mappings = integration.webflow_integrations.field_mappings;
    field_mappings[index] = [e.target.value, { name, slug, id }];

    setIntegration({
      ...integration,
      webflow_integrations: {
        ...integration.webflow_integrations,
        field_mappings,
      },
    });
  }

  if (loading) {
    return (
      <Layout title="" hideHeader={true}>
        loading…
      </Layout>
    );
  }

  return (
    <Layout title={`Edit Integration: ${integration?.name}`}>
      <form onSubmit={handleSubmit}>
        <Input
          value={integration.name}
          handleChange={handleChange}
          placeholder="Name"
          inputName="name"
          label="Name"
        />
        <Toggle
          value={integration.is_active}
          handleChange={handleChecked}
          inputName="is_active"
          label="Set active?"
        />
        <hr className="mb-4" />
        <h4>If you need to update these, please delete and reintegrate</h4>
        <Input
          value={integration.webflow_integrations.site_id}
          handleChange={handleNestedChange}
          placeholder="enter site id"
          inputName="site_id"
          label="Site ID"
          disabled={true}
        />
        <Input
          value={integration.webflow_integrations.collection_id}
          handleChange={handleNestedChange}
          placeholder="enter collection id"
          inputName="collection_id"
          label="Collection ID"
          disabled={true}
        />
        <div className="my-8">
          <h4 className="text-2xl font-bold">Field mappings</h4>
          <h5>Here are the fields from your collection:</h5>

          <div className="bg-white md:w-1/2 p-4 mt-4 rounded-lg border shadow">
            <div className="w-full mb-4 gap-4 hidden md:flex">
              <div className="ml-10 w-1/3">
                <h3 className="font-bold">Webflow Field</h3>
              </div>
              <div className="w-2/3">
                <h3 className="font-bold">Changelog Mapping</h3>
              </div>
            </div>
            {integration?.webflow_integrations?.field_mappings?.map(
              ([value, { name, slug, id }], index) => {
                return (
                  <div
                    key={id}
                    className="flex flex-wrap md:flex-nowrap items-center w-full border mb-2 gap-4 shadow rounded-lg"
                  >
                    <div className="p-1 w-8 h-8 flex items-start justify-center bg-gray-100">
                      {index + 1}
                    </div>
                    <div className="p-1 w-full md:w-1/3">
                      <h6 className="font-bold">{name}</h6>
                    </div>
                    <div className="p-1 w-full md:w-2/3">
                      <select
                        className="w-full"
                        defaultValue={value}
                        onChange={(e) =>
                          handleMapping(e, name, slug, id, index)
                        }
                      >
                        <option value="">No mapping</option>
                        <option value="content">Content</option>
                        <option value="title">Title</option>
                        <option value="categories">Categories</option>
                        <option value="tags">Tags</option>
                        <option value="slug">Slug</option>
                        <option value="created_date">Created date</option>
                        <option value="updated_date">Updated date</option>
                        <option value="published_date">Published Date</option>
                        <option value="is_draft">Is draft?</option>
                        <option value="is_archived">Is archived?</option>
                      </select>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className="flex">
          <Button variant="red" onClick={handleDelete}>
            Delete
          </Button>
          <Button type="submit" />
        </div>
      </form>
    </Layout>
  );
}
