import type { GetServerSidePropsContext } from "next";
import { createClient as serverClient } from "@/utils/supabase/server-props";
// import { createClient } from "@/utils/supabase/component";
import { getUserRoleFromToken } from "@/lib/jwt";

import AdminLayout from "@/components/layouts/AdminLayout/index";
import ManageUser from "@/components/views/Admin/ManageUser";

import { User } from "@supabase/supabase-js";
// import { useEffect, useState } from "react";

interface ManageUserProps {
  user: User;
}

const ManageUserPage = ({ user }: ManageUserProps) => {
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
    <AdminLayout username={user.user_metadata?.full_name}>
      <ManageUser />
    </AdminLayout>
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

  return {
    props: {
      user: session.user,
    },
  };
}

export default ManageUserPage;
