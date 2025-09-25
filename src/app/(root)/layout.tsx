import type { ReactNode } from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Layout = async({ children }: { children: ReactNode }) => {
    const session = await auth();
   console.log("inside root layout", session);
   
     if (!session) redirect("/auth/sign-in");
  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl text-blue-700">
        <Header />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
