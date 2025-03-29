import SignInForm from '@/components/SignInComponents/SignInForm'
import React from 'react'
// import SigninBg from "@/assets/images/signin-background.svg"

function SignIn() {
  return (
    <div className="sign-in-main">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  )
}

export default SignIn