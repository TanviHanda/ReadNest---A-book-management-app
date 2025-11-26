"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { adminSideBarLinks } from "@/constants";
import { cn, getInitials } from "@/lib/utils";

const Sidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="admin-sidebar">
        <div>
          {/* Logo */}
          <Link href="/admin" className="logo group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-admin/10 transition-colors group-hover:bg-primary-admin/20">
              <Image
                src="/icons/admin/logo.svg"
                alt="logo"
                height={24}
                width={24}
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ReadNest</h1>
          </Link>

          <Separator className="my-6 bg-primary-admin/10" />

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {adminSideBarLinks.map((link) => {
              const isSelected =
                (link.route !== "/admin" &&
                  pathname.includes(link.route) &&
                  link.route.length > 1) ||
                pathname === link.route;

              return (
                <Tooltip key={link.route}>
                  <TooltipTrigger asChild>
                    <Link href={link.route}>
                      <div
                        className={cn(
                          "link transition-all duration-200",
                          isSelected
                            ? "bg-primary-admin text-white shadow-md shadow-primary-admin/25"
                            : "text-slate-600 hover:bg-slate-100",
                        )}
                      >
                        <div className="relative size-5">
                          <Image
                            src={link.img}
                            alt={link.text}
                            fill
                            className={cn(
                              "object-contain transition-all",
                              isSelected && "brightness-0 invert",
                            )}
                          />
                        </div>
                        <p
                          className={cn(
                            "font-medium transition-colors",
                            isSelected ? "text-white" : "text-slate-700",
                          )}
                        >
                          {link.text}
                        </p>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="md:hidden">
                    {link.text}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </div>

        {/* User section */}
        <div className="space-y-4">
          <Separator className="bg-slate-200" />

          <div className="user group">
            <Avatar className="h-10 w-10 border-2 border-primary-admin/20">
              <AvatarFallback className="bg-primary-admin/10 text-primary-admin font-semibold">
                {getInitials(session?.user?.name || "AD")}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-1 flex-col max-md:hidden">
              <p className="font-semibold text-dark-400 line-clamp-1">
                {session?.user?.name}
              </p>
              <p className="text-xs text-slate-500 line-clamp-1">
                {session?.user?.email}
              </p>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:bg-red-50 hover:text-red-600 max-md:hidden"
                  asChild
                >
                  <Link href="/api/auth/signout">
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Log out</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
