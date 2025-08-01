"use client";

import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container grid gap-12 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}