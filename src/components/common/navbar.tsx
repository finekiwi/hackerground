"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "/hackathons", label: "해커톤" },
  { href: "/camp", label: "팀 모집" },
  { href: "/rankings", label: "랭킹" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-6xl items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-8">
          <Terminal className="h-5 w-5" />
          <span>Hackerground</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1 flex-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
