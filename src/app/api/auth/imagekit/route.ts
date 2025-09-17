import { env } from "@/lib/env";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imageKit = new ImageKit( {
    privateKey:env.IMAGEKIT_PRIVATE_KEY ,
    publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    
});

export async function GET(){
    return NextResponse.json(imageKit.getAuthenticationParameters());
}