import NextAuth from "next-auth";
import { authOptions } from "@/auth";
// import { handlers } from '@/auth';

const handler = NextAuth(authOptions as any);

// export const {GET, POST} = handlers; 
