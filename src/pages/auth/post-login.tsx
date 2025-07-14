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

  let userRole = getUserRoleFromToken(session.access_token);

  if (!userRole) {
    console.log("No role in token, querying database as a fallback...");
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roleError) {
      console.error(roleError.message);
    }

    // console.log(roleData);

    userRole = roleData?.role;
    // console.log("roleData:", roleData);
  }

  const destination =
    userRole === "admin"
      ? "/admin/dashboard"
      : userRole === "manager"
      ? "/manager/"
      : userRole === "crew"
      ? "/crew/"
      : "/auth/no-role";

  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
}
