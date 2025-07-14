import type { GetServerSidePropsContext } from "next";
import { createClient as serverClient } from "@/utils/supabase/server-props";
// import { createClient } from "@/utils/supabase/component";
import { getUserRoleFromToken } from "@/lib/jwt";

import SidebarLayout from "@/components/layouts/ManagerLayout/index";
import ManageUser from "@/components/views/Admin/ManageUser";

import { User } from "@supabase/supabase-js";
import { Profile, UserRole } from "@/types/profiles";
import { useEffect, useState } from "react";
// import { useEffect, useState } from "react";

interface ManageUserProps {
  user: User;
  profile: Pick<Profile, "full_name"> | null;
  userRole: string;
  allProfile: Profile[];
  allRole: UserRole[];
}

const ManageUserPage = ({
  profile,
  userRole,
  allProfile,
  allRole,
}: ManageUserProps) => {
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [roles, setRoles] = useState<UserRole[] | null>(null);

  useEffect(() => {
    setProfiles(allProfile);
    setRoles(allRole);
  }, [allProfile, allRole]);

  return (
    <SidebarLayout userRole={userRole} username={profile?.full_name}>
      <ManageUser profiles={profiles} roles={roles} />
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

  // get the all user's profile from public.profiles
  const { data: allProfile, error: allProfileError } = await supabase
    .from("profiles")
    .select("*");

  if (allProfileError) {
    console.error("fail to fetch profiles data", allProfileError.message);
  }

  // get the all user's role from public.user_roles
  const { data: allRole, error: allRoleError } = await supabase
    .from("user_roles")
    .select("user_id, role");

  if (allRoleError) {
    console.error("fail to fetch roles data", allRoleError.message);
  }

  console.log("allRole:", allRole);
  console.log("allRoleError:", allRoleError);

  return {
    props: {
      user: session.user,
      profile,
      userRole,
      allProfile,
      allRole,
    },
  };
}

export default ManageUserPage;
