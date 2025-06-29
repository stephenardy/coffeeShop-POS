import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const VerifyAccount = () => {
  const router = useRouter();
  console.log(router.query);
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const { token_hash, type, next } = router.query;

      if (typeof token_hash === "string" && typeof type === "string") {
        setLoading(true);
        console.log("Verifying OTP with:", { token_hash, type }); //debugging
        const { data: userData, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as "signup" | "magiclink" | "recovery" | "invite",
        });
        console.log({ userData, error });
        if (error) {
          console.error("OTP verification failed:", error.message);
        } else {
          setLoading(false);
          router.push((next as string) || "/auth/login");
        }
      }
    };
    verifyEmail();
  }, [router, supabase.auth]);

  if (loading) {
    return <p>Verifying your email and setting up your session...</p>;
  }

  return (
    <div>
      <p>Redirecting you to complete your profile...</p>
    </div>
  );
};

export default VerifyAccount;
