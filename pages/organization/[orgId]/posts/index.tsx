import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Layout from "components/Layout";
import Button from "components/Button";

type Post = {
  id: string;
  title: string;
};

type Posts = Array<Post>;

export default function OrgHome() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [posts, setPosts] = useState<Posts>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPosts() {
      try {
        setLoading(true);

        let { data, error, status } = await supabase
          .from("posts")
          .select()
          .eq("organization_id", router.query.orgId);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setPosts(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (router.query.orgId) {
      getPosts();
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
    <Layout title="All Posts">
      <div className="flex justify-between">
        <h2 className="text-4xl font-bold">Manage your posts</h2>
        <Button
          onClick={() =>
            router.push(`/organization/${router.query.orgId}/posts/add`)
          }
        >
          Add Post
        </Button>
      </div>
      <div className="mt-4">
        <ul className="grid grid-cols-4">
          {posts?.map(({ title, id }) => {
            return (
              <li
                className="border bg-white p-4 rounded-lg flex items-center justify-between cursor-pointer"
                key={id}
                onClick={() =>
                  router.push(
                    `/organization/${router.query.orgId}/posts/edit/${id}`
                  )
                }
              >
                <h3 className="text-xl font-bold underline text-blue-600">
                  {title}
                </h3>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
}
