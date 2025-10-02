import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/Header";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session || !session.user) redirect("/auth/sign-in");

  // session.user.id should be defined because we redirected earlier if no session.user
  const userId = session.user?.id;
  if (!userId) redirect("/auth/sign-in");

  const isAdmin = await db
    .select({ isAdmin: users.role })
    .from(users)
    .where(eq(users.id, userId as string))
    .limit(1)
    .then((res) => res[0]?.isAdmin === "ADMIN");
  if (!isAdmin) redirect("/");
  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} />

      <div className="admin-container">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};

export default Layout;
