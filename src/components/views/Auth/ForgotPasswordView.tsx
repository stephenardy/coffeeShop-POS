import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginArgs } from "@/pages/auth/login";
import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";

type PartialLoginArgs = Pick<loginArgs, "email">;

interface resetProps {
  resetForm: UseFormReturn<{ email: string }>;
  onReset: ({ email }: PartialLoginArgs) => Promise<void>;
  setIsLoginPage: Dispatch<SetStateAction<boolean>>;
}

const ForgotPasswordView = (props: resetProps) => {
  const { resetForm, onReset, setIsLoginPage } = props;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="w-full text-center text-3xl">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Instruction will be send to the email</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(onReset)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={resetForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="cursor-pointer">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="w-full text-center">
          Back to Login Page?{" "}
          <span
            onClick={() => setIsLoginPage(true)}
            className="cursor-pointer hover:underline hover:text-blue-500"
          >
            click here
          </span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordView;
