import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Header({ title }: { title: string }) {
  const supabase = useSupabaseClient();
  const router = useRouter();

  return (
    <header className="header bg-white shadow py-4 px-4">
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
