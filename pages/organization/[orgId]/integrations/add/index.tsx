import { useRouter } from "next/router";
import Layout from "components/Layout";

export default function OrgHome() {
  const router = useRouter();

  return (
    <Layout title="Add Integration">
      <ul>
        <li>
          <button
            type="button"
            onClick={() =>
              router.push(
                `/organization/${router.query.orgId}/integrations/add/webflow`
              )
            }
          >
            Webflow
          </button>
        </li>
      </ul>
    </Layout>
  );
}
