import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {compare} from 'bcryptjs';

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                                const rows: any[] = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, credentials.email.toString()))
                        .limit(1);

                                const user = rows[0];
                      if (!user) return null;

                    const isPasswordValid = await compare(
                        credentials.password.toString(),
                        user.password
                    );

                    if (!isPasswordValid) return null;

                                // Return a minimal user object
                                return {
                                    id: String(user.id),
                                    email: user.email,
                                    name: user.full_name ?? user.fullName ?? null,
                                };
                } catch (err) {
                    // On DB errors, fail authorization gracefully
                    // eslint-disable-next-line no-console
                    console.error("Authorize error:", err);
                    return null;
                }
            },
        }),
    ],
};

// Cast to any to avoid strict NextAuth types in this project setup
export default NextAuth(authOptions as unknown as any);