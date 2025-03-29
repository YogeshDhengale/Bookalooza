import React from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import LogoWithBrandName from "../LogoWithBrandName/LogoWithBrandName";
import { cn } from "@/lib/utils";

const ForgetPasswordForm = () => {
  return (
    <form className={cn("flex flex-col gap-6")}>
      <LogoWithBrandName />
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Hey! enter your details to reset your password.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-1">
          <div className="flex items-center">
            <Label htmlFor="password">Create Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <div className="grid gap-1">
          <div className="flex items-center">
            <Label htmlFor="password">Confirm Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Next
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/sign-in"
          className="underline font-medium underline-offset-4"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default ForgetPasswordForm;
