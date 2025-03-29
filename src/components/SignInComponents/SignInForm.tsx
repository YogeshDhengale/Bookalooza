import { cn } from "@/lib/utils";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router";
import LogoWithBrandName from "../LogoWithBrandName/LogoWithBrandName";
import { signIn } from "@/actions/UserAction/UserAction";
import { useAppDispatch } from "@/hooks/reduxHooks";

const SignInForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries((formData as any).entries()) as {
      userId: string;
      password: string;
    };
    signIn(data, navigate, dispatch);
  };
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="rounded-3xl  md:p-4">
        <LogoWithBrandName className="pt-4" />
        <CardHeader className="md:p-8 md:pt-3">
          <CardTitle className="text-2xl text-app-dark text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Hey ! enter your details to login in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="md:p-8 md:pt-3">
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email / User Id</Label>
                <Input
                  id="email"
                  type="email"
                  name="userId"
                  placeholder="Enter your email / user id"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to={"/forgot-password"}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-app"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/sign-up" className="underline font-medium text-app">
                Sign up
              </Link>
            </div>
            <div className="mt-4 text-center text-sm font-bold">
              Are you a Principal or a School Coordinator?{" "}
              <Link
                to="https://www.bookalooza.com/school-ui"
                target="_blank"
                className="underline text-app"
              >
                Click here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInForm;
