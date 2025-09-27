import React, { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
// import "@/styles/admin.css";
const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session?.user?.id) redirect("/auth/sign-in");
  return (
    <main className="flex min-h-screen w-full flex-row">
      <p>Sidebar</p>
      <div className="admin-container">
        <p>Header</p>
        {children}
      </div>
    </main>
  );
};

export default Layout;
