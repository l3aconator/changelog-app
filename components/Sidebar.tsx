import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

function SidebarItem({
  path,
  title,
  onClick,
}: {
  path: string;
  title: string;
  onClick: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}) {
  const router = useRouter();

  const isActive = router.asPath === path;

  return (
    <li className="my-px">
      <button
        type="button"
        onClick={onClick}
        className={`w-full flex flex-row items-center h-10 px-3 rounded-lg transition-colors hover:bg-gray-700 ${
          isActive ? "bg-gray-800 text-gray-300" : "text-gray-400"
        }`}
      >
        {title}
      </button>
    </li>
  );
}

function SidebarTitle({ title }: { title: string }) {
  return (
    <li className="my-px flex font-medium text-sm text-gray-600 px-4 uppercase w-full">
      <span className="my-4">{title}</span>
    </li>
  );
}

function SidebarLogo() {
  return (
    <div className="inline-flex">
      <a href="#" className="inline-flex flex-row items-center text-white">
        logo
      </a>
    </div>
  );
}

export default function Sidebar() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  return (
    <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-gray-900">
      <div className="sidebar-header flex items-center justify-center py-4">
        <SidebarLogo />
      </div>
      <div className="sidebar-content px-4 py-6">
        <ul className="flex flex-col w-full">
          <SidebarItem
            title="Dashboard"
            path={`/organization/${router.query.orgId}`}
            onClick={() => {
              router.push(`/organization/${router.query.orgId}`);
            }}
          />
          <SidebarItem
            title="Posts"
            path={`/organization/${router.query.orgId}/posts`}
            onClick={() => {
              router.push(`/organization/${router.query.orgId}/posts`);
            }}
          />
          <SidebarTitle title="Something" />
          <SidebarItem
            title="Integrations"
            path={`/organization/${router.query.orgId}/integrations`}
            onClick={() => {
              router.push(`/organization/${router.query.orgId}/integrations`);
            }}
          />
          <SidebarItem
            path="/?loggedOut=true"
            title="Logout"
            onClick={() => {
              supabase.auth.signOut();
              router.replace("/?loggedOut=true");
            }}
          />
        </ul>
      </div>
    </aside>
  );
}
