"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderKanban,
  FileText,
  CheckCircle,
  Calendar,
  Handshake,
  Settings,
  Menu,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "RAID Log", href: "/raid", icon: FileText },
  { name: "Actions", href: "/actions", icon: CheckCircle },
  { name: "Meetings", href: "/meetings", icon: Calendar },
  { name: "Decisions", href: "/decisions", icon: Handshake },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "hidden md:flex flex-col h-full border-r bg-muted/40",
        className
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
        >
          <Image
            src="/helm-logo.svg"
            alt="Helm Logo"
            width={24}
            height={24}
          />
          <span className="text-lg">Helm</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive && "bg-muted text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="User Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="grid leading-tight">
            <span className="font-semibold text-sm">J. Doe</span>
            <span className="text-muted-foreground text-xs">@john.doe</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        <div className="flex h-16 items-center border-b px-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
          >
            <Image
              src="/helm-logo.svg"
              alt="Helm Logo"
              width={24}
              height={24}
            />
            <span className="text-lg">Helm</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      isActive && "bg-muted text-primary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="User Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="grid leading-tight">
              <span className="font-semibold text-sm">J. Doe</span>
              <span className="text-muted-foreground text-xs">@john.doe</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
