import React from "react";
import SignUpForm from "@/components/SignUpComponents/SignUpForm";
import AuthLayout from "@/components/AuthLayout/AuthLayout";

function SignUp() {
  return (
    <AuthLayout>
        <SignUpForm />
    </AuthLayout>
  );
}

export default SignUp;
