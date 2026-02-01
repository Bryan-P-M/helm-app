"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { Separator } from "@/components/ui/separator";

interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const prettifySegment = (segment: string) => {
    const replacements: Record<string, string> = {
      raid: "RAID Log",
      raci: "RACI",
    };
    const replaced = replacements[segment] || segment;
    return replaced
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav className={className} aria-label="breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        <li>
          <Link href="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          return (
            <Fragment key={segment}>
              <li className="flex items-center">
                <Separator
                  orientation="vertical"
                  className="h-4 w-px bg-muted-foreground mx-2"
                />
                {isLast ? (
                  <span className="text-primary font-medium">
                    {prettifySegment(segment)}
                  </span>
                ) : (
                  <Link href={href} className="hover:text-primary">
                    {prettifySegment(segment)}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
