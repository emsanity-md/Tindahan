"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScanBarcode, Boxes, ReceiptText, PackagePlus, Home } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { ResetDemoButton } from "./reset-demo-button";
import { ReloadGuard } from "./reload-guard";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/pos", label: "POS", icon: ScanBarcode },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/sales", label: "Sales", icon: ReceiptText },
  { href: "/products", label: "Products", icon: PackagePlus },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-svh flex-col">
      <ReloadGuard />

      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-gutter md:px-gutter-md">
          <Wordmark />

          <nav className="ml-2 flex items-center gap-1 overflow-x-auto">
            <Link
              href="/"
              title="Landing page"
              aria-label="Landing page"
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                pathname === "/" && "bg-secondary text-foreground",
              )}
            >
              <Home className="size-4" />
            </Link>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  pathname === item.href && "bg-brand-tint font-medium text-accent-foreground",
                )}
              >
                <item.icon className="size-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="ml-auto">
            <ResetDemoButton />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
