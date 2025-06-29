import type { GetServerSidePropsContext } from "next";
import { createClient } from "@/utils/supabase/server-props";

import AdminLayout from "@/components/layouts/AdminLayout/index";
import ManageUser from "@/components/views/Admin/ManageUser";

import { User } from "@supabase/supabase-js";

export interface Profile {
  current_role: string;
  full_name: string;
}

interface ManageUserProps {
  user: User;
  profile: Profile | null;
}

const ManageUserPage = ({ user, profile }: ManageUserProps) => {
  // const router = useRouter();
  // const supabase = createBrowserClient();

  // const [user, setUser] = useState<User | null>(null);
  // const [profile, setProfile] = useState<Profile | null>(null);

  // useEffect(() => {
  //   const getInitialSession = async () => {
  //     // Check session
  //     // const {
  //     //   data: { session },
  //     //   error: sessionError,
  //     // } = await supabase.auth.getSession();

  //     // if (sessionError) {
  //     //   console.error("Error fetching session:", sessionError.message);
  //     //   return;
  //     // }
  //     // console.log(session);

  //     // Get User data (auth.users)
  //     const {
  //       data: { user },
  //       error: userError,
  //     } = await supabase.auth.getUser();

  //     if (userError) {
  //       console.error("Error fetching user data:", userError.message);
  //       await supabase.auth.signOut();
  //       router.push("/auth/login");
  //       return;
  //     }
  //     // setUser(user);
  //     console.log(user);

  //     // Get Profile data (public.profiles)
  //     if (user) {
  //       const { data: profileData, error: profileError } = await supabase
  //         .from("profiles")
  //         .select("current_role, full_name")
  //         .eq("profile_id", user.id)
  //         .single();

  //       if (profileError && profileError.code !== "PGRST116") {
  //         console.error("Error fetching user profile:", profileError.message);
  //         return;
  //       }

  //       // Check role
  //       if (profileData) {
  //         setProfile(profileData);
  //         if (profileData.current_role !== "admin") {
  //           console.error("Only Admin can access this page");
  //           await supabase.auth.signOut();
  //           router.push("/auth/login");
  //         }
  //       } else {
  //         console.warn("No profile found for user:", user.id);
  //         await supabase.auth.signOut();
  //         router.push("/auth/login");
  //       }
  //     }
  //   };

  //   getInitialSession();
  // }, [router, supabase]);
  console.log(user);
  console.log(profile);
  return (
    <AdminLayout profile={profile}>
      <ManageUser />
    </AdminLayout>
  );
};

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

export default ManageUserPage;
