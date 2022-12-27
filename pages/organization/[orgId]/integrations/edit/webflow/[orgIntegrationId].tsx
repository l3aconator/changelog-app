import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Layout from "components/Layout";
import Input from "components/Input";
import Toggle from "components/Toggle";
import Button from "components/Button";

export default function OrgHome() {
  const baseFormState = {
    name: "",
    is_active: false,
    webflow_integrations: {
      site_id: "",
      collection_id: "",
      id: "",
    },
  };
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
      await supabase
        .from("webflow_integrations")
        .delete()
        .eq("id", integration.webflow_integrations.id);

      let { error, status } = await supabase
        .from("organization_integrations")
        .delete()
        .eq("organization_id", router.query.orgId)
        .eq("id", router.query.orgIntegrationId);

      if (error && status !== 406) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    } finally {
      router.push(`/organization/${router.query.orgId}/integrations`);
    }
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
