import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

async function checkIfOrganizationExists(pathname: string, user_id: string) {
  const pathArray = pathname.split("/");

  if (pathArray.includes("organization")) {
    const { data, error } = await supabaseAdmin
      .from("organization_users")
      .select("id")
      .eq("organization_id", pathArray[2])
      .eq("user_id", user_id)
      .single();

    if (error) {
      console.error(error);
      return false;
    }

    return data?.id ? true : false;
  }

  return false;
}

export async function middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next();
  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check auth condition
  if (session?.access_token) {
    // Authentication successful, forward request to protected route.
    if (
      await checkIfOrganizationExists(req.nextUrl.pathname, session.user.id)
    ) {
      return res;
    }
  }

  // Auth condition not met, redirect to home page.
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = "/";
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/organization/:path*"],
};