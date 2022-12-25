import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";

export default function OrgHome() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  return (
    <Layout title="Integrations">
      <>org integrations</>
    </Layout>
  );
}
