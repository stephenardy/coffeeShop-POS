import { getUserRoleFromToken } from "@/lib/jwt";
import { createClient } from "@/utils/supabase/server-props";
import { GetServerSidePropsContext } from "next";

const RouteChecker = () => {
  return null;
};

export default RouteChecker;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);

  // get the authenticated user
  // const {
  //   data: { user },
  //   error: userError,
  // } = await supabase.auth.getUser();

  // if (userError || !user) {
  //   return {
  //     redirect: {
  //       destination: "/auth/login",
  //       permanent: false,
  //     },
  //   };
  // }

  // // get the user's profile from public.profiles
  // const { data: profile, error: profileError } = await supabase
  //   .from("profiles")
  //   .select("current_role")
  //   .eq("profile_id", user.id)
  //   .single();

  // if (profileError && profileError.code !== "PGRST116") {
  //   return {
  //     redirect: {
  //       destination: "/auth/unauthorized",
  //       permanent: false,
  //     },
  //   };
  // }

  // // no profile
  // if (!profile) {
  //   return {
  //     redirect: {
  //       destination: "/auth/no-role",
  //       permanent: false,
  //     },
  //   };
  // }

  // get session
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

  const userRole = getUserRoleFromToken(session.access_token);

  const destination =
    userRole === "admin"
      ? "/admin/dashboard"
      : userRole === "manager"
      ? "/manager/dashboard"
      : userRole === "cashier"
      ? "/cashier/dashboard"
      : "/auth/no-role";

  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
}
