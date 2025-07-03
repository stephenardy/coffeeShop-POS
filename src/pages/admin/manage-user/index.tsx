import type { GetServerSidePropsContext } from "next";
import { createClient as serverClient } from "@/utils/supabase/server-props";
// import { createClient } from "@/utils/supabase/component";
import { getUserRoleFromToken } from "@/lib/jwt";

import SidebarLayout from "@/components/layouts/SidebarLayout/index";
import ManageUser from "@/components/views/Admin/ManageUser";

import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/profiles";
// import { useEffect, useState } from "react";

interface ManageUserProps {
  user: User;
  profile: Profile | null;
  userRole: string;
}

const ManageUserPage = ({ profile, userRole }: ManageUserProps) => {
  // const supabase = createClient();

  // console.log(user);

  // const [usersNoRole, setUserNoRole] = useState<string[] | null>(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const { data, error: fetchError } = await supabase
  //       .from("users")
  //       .select("*");

  //     if (fetchError) {
  //       console.error(fetchError.message);
  //     }

  //     return data;
  //   };
  //   const userData = fetchUser();
  //   console.log(userData);
  // }, [supabase]);

  // console.log("user with no role: ", usersNoRole);

  return (
    <SidebarLayout userRole={userRole} username={profile?.full_name}>
      <ManageUser />
    </SidebarLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = serverClient(context);

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
      user: session.user,
      profile,
      userRole,
    },
  };
}

export default ManageUserPage;
