'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="cursor-pointer">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                XandScan
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Xandeum pNode Network Explorer
              </p>
            </div>
          </Link>
          <nav className="flex gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                className={cn(
                  "text-foreground hover:text-primary",
                  isActive('/') && !pathname.includes('/nodes') && !pathname.includes('/docs') && "bg-muted"
                )}
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/nodes">
              <Button
                variant="ghost"
                className={cn(
                  "text-foreground hover:text-primary",
                  isActive('/nodes') && "bg-muted"
                )}
              >
                Nodes
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                variant="ghost"
                className={cn(
                  "text-foreground hover:text-primary",
                  isActive('/docs') && "bg-muted"
                )}
              >
                Docs
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
