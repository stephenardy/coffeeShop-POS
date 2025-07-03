import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/fragments/Admin/AppSidebar";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
  username: string | null | undefined;
  userRole: string;
}

export default function AdminLayout({
  children,
  username,
  userRole,
}: AdminLayoutProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error Logging Out", error.message);
      return;
    }
    router.push("/auth/login");
  };
  return (
    <SidebarProvider>
      <AppSidebar
        userRole={userRole}
        username={username}
        handleSignOut={handleSignOut}
      />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
