import { createClient } from "@/utils/supabase/server-props";
import { GetServerSidePropsContext } from "next";

const RouteChecker = () => {
  return null;
};

export default RouteChecker;

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
    .select("current_role")
    .eq("profile_id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    return {
      redirect: {
        destination: "/auth/unauthorized",
        permanent: false,
      },
    };
  }

  // no profile
  if (!profile) {
    return {
      redirect: {
        destination: "/auth/no-role",
        permanent: false,
      },
    };
  }

  const destination =
    profile.current_role === "admin"
      ? "/admin/dashboard"
      : profile.current_role === "manager"
      ? "/manager/dashboard"
      : profile.current_role === "cashier"
      ? "/cashier/dashboard"
      : "/auth/no-role";

  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
}
