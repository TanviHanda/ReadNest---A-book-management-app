import React from 'react'

interface Props<T extends FieldValues> {
    type: 'sign-in' | 'sign-up';
}
const AuthForm = ({type, schema, defaultValues, onSubmit}:Props) => {
  return (
    <div>AuthForm</div>
  )
}

export default AuthForm