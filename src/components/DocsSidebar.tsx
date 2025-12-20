'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  Code2,
  Rocket,
  Server,
  Users,
  Database,
  GitBranch
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", icon: BookOpen },
      { title: "Quick Start", href: "/docs/guides/quick-start", icon: Rocket },
    ],
  },
  {
    title: "User Guides",
    items: [
      { title: "Platform Guide", href: "/docs/guides/platform-guide", icon: Users },
      { title: "Understanding Metrics", href: "/docs/guides/metrics", icon: Database },
    ],
  },
  {
    title: "Platform",
    items: [
      { title: "Deployment", href: "/docs/platform/deployment", icon: Server },
      { title: "Architecture", href: "/docs/platform/architecture", icon: GitBranch },
    ],
  },
  {
    title: "API & Integration",
    items: [
      { title: "API Reference", href: "/docs/api/reference", icon: Code2 },
      { title: "Integration Guide", href: "/docs/api/integration", icon: FileText },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card/50 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="p-6 space-y-8">
        {navigation.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
