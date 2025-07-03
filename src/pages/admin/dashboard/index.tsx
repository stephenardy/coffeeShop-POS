import SidebarLayout from "@/components/layouts/SidebarLayout/index";
import { getUserRoleFromToken } from "@/lib/jwt";
import { Profile } from "@/types/profiles";
import { createClient } from "@/utils/supabase/server-props";
import { User } from "@supabase/supabase-js";
import { GetServerSidePropsContext } from "next";

interface dashboardAdminProps {
  user: User;
  profile: Profile | null;
  userRole: string;
}

const AdminDashboardPage = ({ profile, userRole }: dashboardAdminProps) => {
  return (
    <SidebarLayout userRole={userRole} username={profile?.full_name}>
      <h1>THis is dashboard</h1>
    </SidebarLayout>
  );
};

export default AdminDashboardPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);

  // get the authenticated session || user
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  // check user role
  const userRole = getUserRoleFromToken(session.access_token);

  if (userRole === null) {
    return {
      redirect: {
        destination: "/auth/login?error=token_decode_failed",
        permanent: false,
      },
    };
  }

  if (userRole !== "admin") {
    return {
      redirect: {
        destination: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/unauthorized`,
        permanent: false,
      },
    };
  }

  // get the user's profile from public.profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("profile_id", session.user.id)
    .single();

  if (profileError) {
    return {
      redirect: {
        destination: "/auth/login?error=profile_not_found",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userRole,
      user: session.user,
      profile: profile,
    },
  };
}
