import React from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import LogoWithBrandName from "../LogoWithBrandName/LogoWithBrandName";

const SignUpForm = () => {
  return (
    <form className={cn("flex flex-col gap-6")}>
      <LogoWithBrandName />
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Hey! Enter your details to create your account.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="flex gap-4">
          <div className="grid gap-1 flex-1">
            <Label htmlFor="email">First Name</Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter Your First Name"
              required
            />
          </div>
          <div className="grid gap-1 flex-1">
            <Label htmlFor="email">Last Name</Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter Your Last Name"
              required
            />
          </div>
        </div>
        <div className="grid gap-1">
          <Label htmlFor="email">School Name(Optional)</Label>
          <Input
            id="email"
            type="text"
            placeholder="Enter Your School Name"
            required
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-1">
          <div className="flex items-center">
            <Label htmlFor="password">Phone Number</Label>
          </div>
          <Input id="password" type="tel" required />
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
          Sign Up
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

export default SignUpForm;
