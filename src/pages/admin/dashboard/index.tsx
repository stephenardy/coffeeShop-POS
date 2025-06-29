import AdminLayout from "@/components/layouts/AdminLayout";
import { createClient } from "@/utils/supabase/server-props";
import { User } from "@supabase/supabase-js";
import { GetServerSidePropsContext } from "next";

export interface Profile {
  current_role: string;
  full_name: string;
}

interface dashboardAdminProps {
  user: User;
  profile: Profile | null;
}

const AdminDashboardPage = ({ profile }: dashboardAdminProps) => {
  return (
    <AdminLayout profile={profile}>
      <h1>THis is dashboard</h1>
    </AdminLayout>
  );
};

export default AdminDashboardPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);

  // get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  // get the user's profile from public.profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("current_role, full_name")
    .eq("profile_id", user.id)
    .single();

  if (profileError) {
    return {
      redirect: {
        destination: "/auth/login?error=profile_not_found",
        permanent: false,
      },
    };
  }

  if (profile.current_role !== "admin") {
    return {
      redirect: {
        destination: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/unauthorized`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: user,
      profile: profile,
    },
  };
}
