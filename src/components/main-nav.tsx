"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  LineChart,
  MessageSquare,
  Settings,
  CreditCard,
  FileText,
  Video
} from "lucide-react";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard
  },
  {
    title: "Agenda",
    href: "/agenda",
    icon: Calendar
  },
  {
    title: "Pacientes",
    href: "/pacientes",
    icon: Users
  },
  {
    title: "Marketing",
    href: "/marketing",
    icon: LineChart
  },
  {
    title: "Comunicação",
    href: "/comunicacao",
    icon: MessageSquare
  },
  {
    title: "Telemedicina",
    href: "/telemedicina",
    icon: Video
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: CreditCard
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: FileText
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings
  }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {mainNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span className="hidden md:inline-block">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}