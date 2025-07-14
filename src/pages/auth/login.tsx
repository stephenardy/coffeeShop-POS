import AuthLayout from "@/components/layouts/AuthLayout";
import LoginView from "@/components/views/Auth/LoginView";
import ForgotPasswordView from "@/components/views/Auth/ForgotPasswordView";

import { createClient } from "@/utils/supabase/component";
import { GetServerSidePropsContext } from "next";
import { createClient as serverClient } from "@/utils/supabase/server-props";

import { useRouter } from "next/router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { getUserRoleFromToken } from "@/lib/jwt";

const formSchema = z.object({
  email: z.string().email({ message: "Please input correct email" }),
});

export interface loginArgs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const supabase = createClient();

  const [isLoginPage, setIsLoginPage] = useState(true);

  const resetForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleLogin = async ({ email, password }: loginArgs) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      return;
    }
    // Try refreshing the session to get updated claims
    const { data: refreshData, error: refreshError } =
      await supabase.auth.refreshSession();

    if (refreshError) {
      console.error("Session refresh failed:", refreshError.message);
    }

    // Check the new token
    let userRole = null;
    if (refreshData.session) {
      console.log("Session refreshed, checking token...");
      userRole = getUserRoleFromToken(refreshData.session.access_token);
      console.log("User role after refresh:", userRole);
    }

    // // Wait for session to be available
    // let tries = 0;
    // let session = null;
    // while (tries < 5 && !session) {
    //   const { data } = await supabase.auth.getSession();
    //   session = data.session;
    //   if (!session) await new Promise((res) => setTimeout(res, 200));
    //   tries++;
    // }

    // if (!session) {
    //   console.error("Session not available after login.");
    //   return;
    // }

    router.push("/auth/post-login");
  };

  const handleReset = async (values: z.infer<typeof formSchema>) => {
    const { data, error: resetRequestError } =
      await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: "http://localhost:3000/auth/reset-password",
      });

    if (resetRequestError) {
      console.error(
        "error send reset password request",
        resetRequestError.message
      );
      return;
    }

    console.log(data);
    setIsLoginPage(true);
    toast("Reset password instruction sent to user email.");
  };

  return (
    <AuthLayout>
      {isLoginPage ? (
        <LoginView onLogin={handleLogin} setIsLoginPage={setIsLoginPage} />
      ) : (
        <ForgotPasswordView
          resetForm={resetForm}
          onReset={handleReset}
          setIsLoginPage={setIsLoginPage}
        />
      )}
    </AuthLayout>
  );
};

export default LoginPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = serverClient(context);

  // get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return {
      redirect: {
        destination: "/auth/post-login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: user,
    },
  };
}
