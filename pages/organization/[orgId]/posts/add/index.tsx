import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import Layout from "components/Layout";
import Button from "components/Button";
import Input from "components/Input";

type Post = {
  title: string;
};

const DynamicEditor = dynamic(() => import("components/Editor"), {
  ssr: false,
});

export default function OrgHome() {
  const basePost = {
    title: "",
  } as Post;
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(basePost);
  const [editorState, setEditorState] = useState("");

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    setPost({ ...post, [e.target.name]: e.target.value });
  }

  function onEditorStateChange(editorState: string) {
    setEditorState(editorState);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { title } = post;

    try {
      let { error, status } = await supabase.from("posts").insert({
        content: editorState,
        title,
        is_draft: false,
        is_archived: false,
        external_id: null,
        integration_id: null,
        categories: [],
        tags: [],
        organization_id: router.query.orgId,
      });

      if (error && status !== 406) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    } finally {
      router.push(`/organization/${router.query.orgId}/posts`);
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
    <Layout title="New Post">
      <form onSubmit={handleSubmit}>
        <Input
          value={post.title}
          handleChange={handleChange}
          placeholder="Title…"
          inputName="title"
          label="Title"
        />
        <div className="bg-white">
          <DynamicEditor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
          />
        </div>
        <div className="flex mt-4">
          <Button variant="red" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={!post.title} />
        </div>
      </form>
    </Layout>
  );
}
