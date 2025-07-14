import Image from "next/image";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";
const NoRolePage = () => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error.message);
      return;
    }

    router.push("/auth/login");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center max-w-md">
        <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px]">
          <Image
            src="/no-role.svg"
            alt="success-image"
            width={480}
            height={480}
            className="w-full h-auto"
          />
        </div>

        <p className="text-base mt-2">You don{"'"}t have a role yet.</p>
        <p className="text-sm mt-1 text-gray-600 font-light">
          Please contact your manager for role assignment
        </p>
        <p className="text-sm mt-1 text-gray-600 font-light">or</p>
        <button
          onClick={handleLogout}
          className="hover:underline cursor-pointer"
        >
          click here for sign out
        </button>
      </div>
    </div>
  );
};

export default NoRolePage;
