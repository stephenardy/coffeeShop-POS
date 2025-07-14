import { createClient } from "@/utils/supabase/server-props";
import { GetServerSidePropsContext } from "next";
import { getUserRoleFromToken } from "./jwt";

export async function requireAdmin(context: GetServerSidePropsContext) {
  const supabase = createClient(context);

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return {
      redirect: {
        destination: "/auth/login?error=no_session_found",
        permanent: false,
      },
    };
  }

  let userRole = getUserRoleFromToken(session.access_token);

  if (!userRole) {
    const { data: roleData, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error || !roleData) {
      console.error("fetch role from public.user_roles failed!");
      return;
    }

    userRole = roleData.role;
  }

  if (userRole !== "admin") {
    return {
      redirect: {
        destination: `/auth/unauthorized?error=${userRole}_role_unauthorized`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      userId: session.user.id,
    },
  };
}
