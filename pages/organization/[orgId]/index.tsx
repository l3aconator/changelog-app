import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Layout from "components/Layout";
import Button from "components/Button";

export default function OrgHome() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <Layout title="" hideHeader={true}>
        loading…
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div>
        <Button
          onClick={() =>
            router.push(`/organization/${router.query.orgId}/integrations/add`)
          }
        >
          Add integration
        </Button>
      </div>
    </Layout>
  );
}
