import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Footer() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  return (
    <footer className="footer px-4 py-6">
      <div className="footer-content">
        <p className="text-sm text-gray-600 text-center">
          © Brandname 2020. All rights reserved.{" "}
        </p>
      </div>
    </footer>
  );
}
