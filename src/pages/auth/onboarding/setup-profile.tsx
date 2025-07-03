import AuthLayout from "@/components/layouts/AuthLayout";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { GetServerSidePropsContext } from "next";
import { createClient } from "@/utils/supabase/server-props";
import { createClient as createBrowserClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Full Name must be at least 2 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

const SetupProfilePage = () => {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { fullName, password } = values;
    console.log({ fullName, password });

    // Update user account (auth.users)
    // reference: https://supabase.com/docs/reference/javascript/auth-updateuser

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.updateUser({
      password,
      // data: {
      //   full_name: fullName,
      // },
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    // Update user profile (public.profiles)
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("profile_id", user?.id);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    setError("");
    router.push("/auth/onboarding/success");
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="w-full text-center text-3xl">
            Account Verificatoin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="***" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="***" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="cursor-pointer sm:ml-2">
                Submit
              </Button>
            </form>
          </Form>
          {error !== "" && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </AuthLayout>
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

  return {
    props: {
      user: user,
    },
  };
}

export default SetupProfilePage;
