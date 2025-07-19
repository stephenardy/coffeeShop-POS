import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/fragments/AppSidebar";
import { useRouter } from "next/router";
import { getPageHead } from "@/utils/path/getPageHead";
// import { createClient as serverClient } from "@/utils/supabase/server-props";
// import { GetServerSidePropsContext } from "next";

interface CrewLayoutProps {
  children: React.ReactNode;
  username: string | null | undefined;
  // userRole: string;
}

export default function CrewLayout({
  children,
  username,
}: // userRole,
CrewLayoutProps) {
  const router = useRouter();
  const title = getPageHead(router.pathname);

  return (
    <SidebarProvider>
      <AppSidebar
        // userRole={userRole}
        userRole="crew"
        username={username}
      />
      <main className="w-full container mx-2 mt-2 bg-background">
        <div className="flex flex-row items-center">
          <SidebarTrigger />
          <h3>{title}</h3>
        </div>
        <div className="border-1 rounded-2xl mt-1 mb-4" />
        {children}
      </main>
    </SidebarProvider>
  );
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const supabase = serverClient(context);

//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser();

//   if (error || !user) {
//     console.error("failed retrieve user info in Sidebar");
//     return;
//   }

//   const { data: profile, error: profileError } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("profile_id", user.id)
//     .single();

//   if (profileError || !profile) {
//     console.error("failed retrieve user info in Sidebar");
//     return;
//   }

//   const { data: role, error: roleError } = await supabase
//     .from("user_roles")
//     .select("*")
//     .eq("user_id", user.id)
//     .single();

//   if (roleError || !role) {
//     console.error("failed retrieve role info in Sidebar");
//     return;
//   }

//   return {
//     props: {
//       username: profile.full_name,
//       userRole: role.role,
//     },
//   };
// }
