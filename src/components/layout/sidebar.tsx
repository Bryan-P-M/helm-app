"use client";

import React, { useEffect, useState } from "react";
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
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "RAID Log", href: "/raid", icon: FileText },
  { name: "Actions", href: "/actions", icon: CheckCircle },
  { name: "Meetings", href: "/meetings", icon: Calendar },
  { name: "Decisions", href: "/decisions", icon: Handshake },
  { name: "Settings", href: "/settings", icon: Settings },
];

// --- GOOD PART: getInitials Helper ---
function getInitials(profile?: Profile | null): string {
  if (!profile) return "?";
  const { full_name, email } = profile;
  if (full_name) {
    return full_name
      .split(" ")
      .map((n) => n[0] ?? "")
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }
  if (email) return email[0]?.toUpperCase() ?? "?";
  return "?";
}

// --- Custom Hook For User Profile Fetch ---
function useUserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          if (!ignore) {
            setProfile(null);
            setLoading(false);
          }
          return;
        }
        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, full_name, avatar_url")
          .eq("id", session.user.id)
          .single();
        if (!ignore) {
          if (error) {
            setProfile(null);
          } else {
            setProfile(data as Profile);
          }
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setProfile(null);
          setLoading(false);
        }
      }
    };
    fetchProfile();
    return () => {
      ignore = true;
    };
  }, []);

  return { profile, loading };
}

// --- GOOD PART: UserProfile Sub-Component (simplified, no ternary) ---
interface UserProfileProps {
  profile: Profile | null;
  loading: boolean;
}

function UserProfile({ profile, loading }: UserProfileProps) {
  const initials = getInitials(profile);
  return (
    <div className="flex items-center gap-3 p-4 border-t">
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={profile?.avatar_url || undefined}
          alt={profile?.full_name || profile?.email || "User"}
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col truncate">
        <span className="text-sm font-medium text-foreground truncate">
          {profile?.full_name || profile?.email || "Guest"}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          {profile?.email || "No email"}
        </span>
      </div>
    </div>
  );
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { profile, loading } = useUserProfile();

  return (
    <div
      className={cn(
        "hidden md:flex flex-col h-full border-r bg-muted/40",
        className
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/helm-logo.svg" alt="Helm Logo" width={24} height={24} />
          <span className="text-lg">Helm</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
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
      <UserProfile profile={profile} loading={loading} />
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const { profile, loading } = useUserProfile();

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
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/helm-logo.svg" alt="Helm Logo" width={24} height={24} />
            <span className="text-lg">Helm</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
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
        <UserProfile profile={profile} loading={loading} />
      </SheetContent>
    </Sheet>
  );
}
