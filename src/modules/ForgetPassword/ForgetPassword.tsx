import AuthLayout from '@/components/AuthLayout/AuthLayout'
import ForgetPasswordForm from '@/components/ForgetPasswordComponents/ForgetPasswordForm'
import React from 'react'

function ForgetPassword() {
  return (
    <AuthLayout>
        <ForgetPasswordForm />
    </AuthLayout>
  )
}

export default ForgetPassword