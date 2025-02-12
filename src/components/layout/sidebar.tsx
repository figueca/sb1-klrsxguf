import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  LineChart,
  MessageSquare,
  Video,
  CreditCard,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Brain
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    description: "Visão geral da clínica"
  },
  {
    title: "Agenda",
    href: "/agenda",
    icon: Calendar,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    description: "Consultas e horários"
  },
  {
    title: "Pacientes",
    href: "/pacientes",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Gerenciar pacientes"
  },
  {
    title: "Marketing",
    href: "/marketing",
    icon: LineChart,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    description: "Campanhas e análises"
  },
  {
    title: "Comunicação",
    href: "/comunicacao",
    icon: MessageSquare,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    description: "Chat e mensagens"
  },
  {
    title: "Telemedicina",
    href: "/telemedicina",
    icon: Video,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    description: "Consultas online"
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: CreditCard,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    description: "Controle financeiro"
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: FileText,
    color: "text-lime-500",
    bgColor: "bg-lime-500/10",
    description: "Análise de dados"
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    description: "Preferências do sistema"
  }
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-3 mb-8">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-violet-500">Psy360</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-muted"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="space-y-1 px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 group relative",
                isActive ? cn("bg-secondary text-primary", item.bgColor) : "hover:bg-secondary/80",
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <div className={cn(
                "flex items-center justify-center",
                isActive && "text-primary"
              )}>
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              {!isCollapsed && (
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  isActive && "text-primary font-semibold"
                )}>
                  {item.title}
                </span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 hidden group-hover:block">
                  <div className="bg-popover px-3 py-2 rounded-md shadow-md border">
                    <p className="text-sm font-medium whitespace-nowrap">{item.title}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{item.description}</p>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn(
        "absolute bottom-8 left-0 right-0 px-3",
        isCollapsed ? "mx-auto w-12" : "px-6"
      )}>
        <Button
          variant="ghost"
          className={cn(
            "w-full rounded-lg hover:bg-muted",
            isCollapsed ? "justify-center px-0" : "justify-start gap-3"
          )}
        >
          <LogOut className="h-5 w-5 text-red-500" />
          {!isCollapsed && (
            <span className="text-sm font-medium text-red-500">Sair</span>
          )}
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-64 bg-background border-r shadow-lg transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <div
      className={cn(
        "relative min-h-screen border-r bg-background transition-all duration-300",
        isCollapsed ? "w-[4.5rem]" : "w-64"
      )}
    >
      {sidebarContent}
    </div>
  );
}