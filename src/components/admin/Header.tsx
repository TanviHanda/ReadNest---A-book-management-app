"use client";

import type { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { BookOpen, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

const getPageInfo = (pathname: string) => {
  const routes: Record<string, { title: string; description: string }> = {
    "/admin": {
      title: "Dashboard",
      description: "Monitor all of your users and books here",
    },
    "/admin/users": {
      title: "All Users",
      description: "Manage and view all registered users",
    },
    "/admin/books": {
      title: "All Books",
      description: "Browse and manage the book collection",
    },
    "/admin/books/new": {
      title: "Add New Book",
      description: "Add a new book to the library",
    },
    "/admin/borrow-records": {
      title: "Borrow Records",
      description: "Track all book borrowing activity",
    },
    "/admin/account-requests": {
      title: "Account Requests",
      description: "Review pending account registrations",
    },
    "/admin/config": {
      title: "Configuration",
      description: "Manage system settings and preferences",
    },
  };

  return routes[pathname] || { title: "Admin", description: "Admin Panel" };
};

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  const { title, description } = getPageInfo(pathname);

  return (
    <header className="admin-header">
      {/* Left side - Page info */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-dark-400">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      {/* Right side - Search and actions */}
      <div className="flex items-center gap-3">
        {/* Library link */}
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-primary-admin"
          asChild
        >
          <Link href="/library">
            <BookOpen className="h-4 w-4" />
            Browse Library
          </Link>
        </Button>

        <Separator orientation="vertical" className="hidden h-8 sm:block" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 hover:bg-slate-100"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary-admin/10 text-primary-admin text-sm font-medium">
                  {getInitials(session?.user?.name || "AD")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium text-dark-400">
                  {session?.user?.name}
                </span>
                <span className="text-xs text-slate-500">Administrator</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-slate-500">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/config" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="cursor-pointer">
                Back to Main Site
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
