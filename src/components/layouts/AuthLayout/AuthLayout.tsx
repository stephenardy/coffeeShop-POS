import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = (props: AuthLayoutProps) => {
  const { children } = props;
  return (
    <div className="w-full h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
