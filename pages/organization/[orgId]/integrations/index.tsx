import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Layout from "components/Layout";
import Button from "components/Button";

function whichIntegration(id_columns: [string, string][]) {
  return id_columns.map(([key, value]) => {
    switch (key) {
      case "webflow_integration_id":
        if (value !== "") {
          return "webflow";
        }
      default:
        return;
    }
  })[0];
}

type Integration = {
  id: string;
  name: string;
  webflow_integration_id: string;
};

type Integrations = Array<Integration>;

export default function OrgHome() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [integrations, setIntegrations] = useState<Integrations>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getIntegrations() {
      try {
        setLoading(true);

        let { data, error, status } = await supabase
          .from("organization_integrations")
          .select()
          .eq("organization_id", router.query.orgId);
        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setIntegrations(data);
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (router.query.orgId) {
      getIntegrations();
    }
  }, [router, supabase]);

  if (loading) {
    return (
      <Layout title="" hideHeader={true}>
        loading…
      </Layout>
    );
  }

  return (
    <Layout title="Integrations">
      <div className="flex justify-between">
        <h2 className="text-4xl font-bold">Manage your integrations</h2>
        <Button
          onClick={() =>
            router.push(`/organization/${router.query.orgId}/integrations/add`)
          }
        >
          Add integration
        </Button>
      </div>
      <div className="mt-4">
        <ul className="grid grid-cols-4">
          {integrations?.map(({ name, id, webflow_integration_id }) => {
            return (
              <li
                className="border bg-white p-4 rounded-lg flex items-center justify-between"
                key={id}
              >
                <h3
                  className="text-xl font-bold cursor-pointer underline text-blue-600"
                  onClick={() =>
                    router.push(
                      `/organization/${
                        router.query.orgId
                      }/integrations/edit/${whichIntegration([
                        ["webflow_integration_id", webflow_integration_id],
                      ])}/${id}`
                    )
                  }
                >
                  {name}
                </h3>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
}
