"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import Image from "next/image";

interface LogoutButtonProps {
  onLogout: () => Promise<void>;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await onLogout();
    });
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isPending}
      variant="outline"
      className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
    >
      <Image
        src="/icons/logout.svg"
        alt="logout"
        width={20}
        height={20}
        className="brightness-0 saturate-100"
      />
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
