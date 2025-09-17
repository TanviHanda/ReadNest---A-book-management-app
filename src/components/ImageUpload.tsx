'use client'
import { IKImage, ImageKitProvider, IKUpload } from 'imagekitio-next';
import config from '@/lib/config'
import React, { useState } from 'react'
import { env } from '@/lib/env';
import { useRef } from 'react';
import ImageKit from 'imagekit';

const {
  env: {
    imageKit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, token, expire } = data;
    return { signature, token, expire };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const ImageUpload = () => {
  const ikUploadRef = useRef(initialValue: null);
  const [file,setFile] = useState<{filePath: string} | null>
  (initialState: null);
  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload/>
    </ImageKitProvider>
  )
}

export default ImageUpload
