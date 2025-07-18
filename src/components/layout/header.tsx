import { UserNav } from "@/components/user-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-end gap-4">
        <UserNav />
      </div>
    </header>
  );
}