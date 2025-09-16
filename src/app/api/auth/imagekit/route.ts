import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";
const {
    env: 
    {
        imageKit: 
        {
            publicKey, privateKey, urlEndpoint
        }
    }
} = config;
const imageKit = new ImageKit(opts: {
    publicKey,
    privateKey ,
    urlEndpoint  
});

export async function GET(){
    return NextResponse.json(imageKit.getAuthenticationParameters());
}