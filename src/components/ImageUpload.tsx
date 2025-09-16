'use client'
import React from 'react'
import {IKImage, ImageKitProvider, IkUpload} from '@imagekit/next';
import config from '@/lib/config';
try{
  const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

  if(!response.ok){
    const errorText = await response.text();

    throw new Error (message: `Request failed with status ${response.status}: ${errorText}`)
  }
  const data = await response.json();
  const {signature, token, expire} = data;
  return {signature, token, expire};
}catch(error: any){
  throw new Error(message: `Authentication request`)
}
const ImageUpload =() => {

  return (
    <ImageKitProvider publicKey={}>

    </ImageKitProvider>
  )
}

export default ImageUpload