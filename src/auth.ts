import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Persist user's id, role, and status into the JWT when they sign in
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { id?: string; role?: string; status?: string };
        (token as unknown as { id?: string; role?: string; status?: string }).id = u.id ?? token.sub;
        (token as unknown as { id?: string; role?: string; status?: string }).role = u.role;
        (token as unknown as { id?: string; role?: string; status?: string }).status = u.status;
      }
      return token;
    },

    // Make the id, role, and status available on the session object
    async session({ session, token }) {
      if (session?.user) {
        const t = token as unknown as { id?: string; sub?: string; role?: string; status?: string };
        (session.user as unknown as { id?: string; role?: string; status?: string }).id = t.id ?? t.sub;
        (session.user as unknown as { id?: string; role?: string; status?: string }).role = t.role;
        (session.user as unknown as { id?: string; role?: string; status?: string }).status = t.status;
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

          // Return user with role and status
          return {
            id: String(user.id),
            email: user.email,
            name: user.fullName ?? null,
            role: user.role ?? "USER",
            status: user.status ?? "PENDING",
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],
});

// Cast to any to avoid strict NextAuth types in this project setup
