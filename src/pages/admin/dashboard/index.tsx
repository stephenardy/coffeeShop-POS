import SidebarLayout from "@/components/layouts/ManagerLayout/index";
import { getUserRoleFromToken } from "@/lib/jwt";
// import { withAdminAccess } from "@/lib/withAdminAccess";
import { Profile } from "@/types/profiles";
import { createClient } from "@/utils/supabase/server-props";
import { User } from "@supabase/supabase-js";
import { GetServerSidePropsContext } from "next";
// import { GetServerSideProps} from "next";

interface dashboardAdminProps {
  user: User;
  profile: Pick<Profile, "full_name"> | null;
  userRole: string;
}

const AdminDashboardPage = ({ profile, userRole }: dashboardAdminProps) => {
  return (
    <SidebarLayout username={profile?.full_name} userRole={userRole}>
      <h1>THis is dashboard</h1>
    </SidebarLayout>
  );
};

export default AdminDashboardPage;

// export const getServerSideProps = requireAdmin;

// export const getServerSideProps = withAdminAccess(async (context) => {
//   const supabase = createClient(context);

//   // get userId from requireAdmin props
//   const userId = (context as any).userId;

//   // get profile
//   const { data: profile, error: profileError } = await supabase
//     .from("profiles")
//     .select("full_name")
//     .eq("profile_id", userId)
//     .single();

//   if (profileError) {
//     return {
//       redirect: {
//         destination: "/auth/login?error=profile_not_found",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       profile,
//     },
//   };
// });

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
