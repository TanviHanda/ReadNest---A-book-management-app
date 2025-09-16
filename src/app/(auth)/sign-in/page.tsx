'use client'

import React from 'react'
import AuthForm from '@/components/AuthForm'
import { signInSchema } from '@/lib/validation'

const page = () => {
  return (
    <AuthForm 
    type="SIGN_IN"
    schema={signInSchema}
    defaultValues={{
      email: '', 
      password: '',
    }}
    onSubmit={()=>{}}
    />
  )
}

export default page