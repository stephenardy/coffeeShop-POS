import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/fragments/Admin/AppSidebar";
import { Profile } from "@/pages/admin/manage-user";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
  profile: Profile | null;
}

export default function AdminLayout({ children, profile }: AdminLayoutProps) {
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
      <AppSidebar profile={profile} handleSignOut={handleSignOut} />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
