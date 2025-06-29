import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginArgs } from "@/pages/auth/login";
import { Dispatch, SetStateAction, useState } from "react";

interface LoginProps {
  onLogin: ({ email, password }: loginArgs) => Promise<void>;
  setIsLoginPage: Dispatch<SetStateAction<boolean>>;
}

const LoginView = ({ onLogin, setIsLoginPage }: LoginProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="w-full text-center text-3xl">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin({ email, password });
          }}
        >
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Button className="w-full cursor-pointer" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <p className="w-full text-center">
          Forgot Password?{" "}
          <span
            onClick={() => setIsLoginPage(false)}
            className="cursor-pointer hover:underline hover:text-blue-500"
          >
            click here
          </span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginView;
