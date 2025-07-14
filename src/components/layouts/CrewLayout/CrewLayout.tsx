import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/fragments/AppSidebar";
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
  return (
    <SidebarProvider>
      <AppSidebar
        // userRole={userRole}
        userRole="crew"
        username={username}
      />
      <main className="w-full">
        <SidebarTrigger />
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
