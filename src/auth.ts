import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Persist user's id into the JWT when they sign in
    async jwt({ token, user }) {
      if (user) {
        // user.id was returned from `authorize`
        const u = user as unknown as { id?: string };
        // token may already have sub, use it as fallback
        (token as unknown as { id?: string }).id = u.id ?? token.sub;
      }
      return token;
    },

    // Make the id available on the session object
    async session({ session, token }) {
      if (session?.user) {
        // Attach id from token (or fallback to token.sub)
        const t = token as unknown as { id?: string; sub?: string };
        (session.user as unknown as { id?: string }).id = t.id ?? t.sub;
      }
      return session;
    },
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
          const rows = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email.toString()))
            .limit(1);

          const user = rows[0];
          if (!user) return null;

          const isPasswordValid = await compare(
            credentials.password.toString(),
            user.password,
          );

          if (!isPasswordValid) return null;
          console.log("user is:", user);

          // Return a minimal user object
          return {
            id: String(user.id),
            email: user.email,
            name: user.fullName ?? null,
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
});

// Cast to any to avoid strict NextAuth types in this project setup
