import { useEffect } from "react";
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id && router.query.loggedOut !== "true") {
      router.push(`/organization/${session?.user?.id}`);
    }

    if (!session && router.query.loggedOut === "true") {
      router.replace("/");
    }
  }, [session, router]);

  return (
    <div>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        redirectTo={`/organization/${session?.user?.id}`}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session && ctx.query.loggedOut !== "true")
    return {
      redirect: {
        destination: `/organization/${session.user.id}`,
        permanent: false,
      },
    };

  return {
    props: {},
  };
};
