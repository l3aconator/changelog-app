import { useEffect, useState } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Layout from "components/Layout";
import Input from "components/Input";
import Toggle from "components/Toggle";
import Button from "components/Button";

export default function OrgWebflowIntegration() {
  const baseFormState = {
    name: "",
    is_active: false,
    sync_frequency: "",
    organization_id: "",
    webflow_integrations: {
      site_id: "",
      collection_id: "",
      id: "",
    },
  };
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();
  const [formState, setFormState] = useState(baseFormState);
  const [org, setOrg] = useState({ webflow_access_token: "" });
  const [siteIdFound, setSiteIdFound] = useState(false);
  const [siteIdResults, setSiteIdResults] = useState([]);
  const [collectionIdFound, setCollectionIdFound] = useState(false);
  const [collectionIdResults, setCollectionIdResults] = useState([]);

  useEffect(() => {
    async function getOrg() {
      let { data } = await supabase
        .from("organizations")
        .select()
        .eq("id", router.query.orgId)
        .single();
      setOrg(data);
    }

    if (router.query.orgId) {
      getOrg();
    }
  }, [router, supabase]);

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  function handleChecked(e: React.ChangeEvent<HTMLInputElement>) {
    setFormState({ ...formState, [e.target.name]: !formState.is_active });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const { name, is_active, sync_frequency, webflow_integrations } =
        formState;

      let { data } = await supabase
        .from("webflow_integrations")
        .insert({
          site_id: webflow_integrations.site_id,
          collection_id: webflow_integrations.collection_id,
        })
        .select()
        .single();

      if (!data) {
        throw Error;
      }

      let { error, status } = await supabase
        .from("organization_integrations")
        .insert({
          name,
          is_active,
          sync_frequency,
          webflow_integration_id: data.id,
          organization_id: router.query.orgId,
        });

      if (error && status !== 406) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFormState(baseFormState);
      router.push(`/organization/${router.query.orgId}/integrations`);
    }
  }

  function handleNestedChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    setFormState({
      ...formState,
      webflow_integrations: {
        ...formState.webflow_integrations,
        [e.target.name]: e.target.value,
      },
    });
  }

  async function handleSiteSearch() {
    setSiteIdFound(!siteIdFound);

    if (!siteIdFound === true) {
      const response = await fetch(
        `/api/${router.query.orgId}/adapters/webflow-search?type=site-id`
      );
      const { sites } = await response.json();

      setSiteIdResults(sites);
    } else {
      setSiteIdResults([]);
    }
  }
  async function handleCollectionSearch() {
    setCollectionIdFound(!collectionIdFound);

    if (!collectionIdFound === true) {
      const response = await fetch(
        `/api/${router.query.orgId}/adapters/webflow-search?type=collection-id&site_id=${formState.webflow_integrations.site_id}`
      );
      const { collections } = await response.json();

      setCollectionIdResults(collections);
    } else {
      setCollectionIdResults([]);
    }
  }

  return (
    <Layout title={`Add Integration: Webflow`}>
      <form onSubmit={handleSubmit}>
        <Input
          value={formState.name}
          handleChange={handleChange}
          placeholder="Name"
          inputName="name"
          label="Name"
        />
        <Toggle
          value={formState.is_active}
          handleChange={handleChecked}
          inputName="is_active"
          label="Set active?"
        />
        <hr className="mb-4" />
        {org?.webflow_access_token ? (
          <>
            <div>
              <Input
                value={formState.webflow_integrations.site_id}
                handleChange={handleNestedChange}
                placeholder="enter site id"
                inputName="site_id"
                label="Site ID"
              />
              <button type="button" onClick={handleSiteSearch}>
                Help me find
              </button>
              {siteIdFound && (
                <div>
                  {siteIdResults.map(({ name, _id }) => {
                    return (
                      <button
                        key={_id}
                        type="button"
                        onClick={() => {
                          setFormState((v) => ({
                            ...v,
                            webflow_integrations: {
                              ...v.webflow_integrations,
                              site_id: _id,
                            },
                          }));
                          setSiteIdFound(false);
                          setSiteIdResults([]);
                        }}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <Input
                value={formState.webflow_integrations.collection_id}
                handleChange={handleNestedChange}
                placeholder="enter collection id"
                inputName="collection_id"
                label="Collection ID"
                disabled={!formState.webflow_integrations.site_id}
              />
              <button
                type="button"
                onClick={handleCollectionSearch}
                disabled={!formState.webflow_integrations.site_id}
              >
                Help me find
              </button>
              {collectionIdFound && (
                <div>
                  {collectionIdResults.map(({ name, _id }) => {
                    return (
                      <button
                        key={_id}
                        type="button"
                        onClick={() => {
                          setFormState((v) => ({
                            ...v,
                            webflow_integrations: {
                              ...v.webflow_integrations,
                              collection_id: _id,
                            },
                          }));
                          setCollectionIdFound(false);
                          setCollectionIdResults([]);
                        }}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <Button
            variant="green"
            onClick={() =>
              router.push(`/api/${router.query.orgId}/authorize/webflow`)
            }
          >
            Authorize Webflow
          </Button>
        )}
        <Button
          type="submit"
          disabled={
            !org?.webflow_access_token ||
            !formState.webflow_integrations.site_id ||
            !formState.webflow_integrations.collection_id
          }
        />
      </form>
    </Layout>
  );
}
