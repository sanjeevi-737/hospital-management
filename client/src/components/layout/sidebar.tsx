import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  Receipt,
  Building2,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useAuthStore } from "@/stores/auth-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    ],
  },
  {
    title: "Clinical",
    items: [
      { label: "Patients", href: "/patients", icon: <Users className="h-5 w-5" /> },
      { label: "Doctors", href: "/doctors", icon: <Stethoscope className="h-5 w-5" /> },
      { label: "Appointments", href: "/appointments", icon: <Calendar className="h-5 w-5" /> },
      { label: "Medical Records", href: "/medical-records", icon: <FileText className="h-5 w-5" /> },
      { label: "Prescriptions", href: "/prescriptions", icon: <Pill className="h-5 w-5" /> },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Pharmacy", href: "/pharmacy", icon: <HeartPulse className="h-5 w-5" /> },
      { label: "Laboratory", href: "/laboratory", icon: <FlaskConical className="h-5 w-5" /> },
      { label: "Billing", href: "/billing", icon: <Receipt className="h-5 w-5" /> },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Departments", href: "/departments", icon: <Building2 className="h-5 w-5" /> },
      { label: "Analytics", href: "/analytics", icon: <BarChart3 className="h-5 w-5" /> },
      { label: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const { isCollapsed, toggle } = useSidebarStore();
  const { user } = useAuthStore();

  const pathname = location.pathname;

  const filteredGroups = navGroups.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.roles || (user?.role && item.roles.includes(user.role))
    ),
  }));

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const SidebarLink = ({ item }: { item: NavItem }) => {
    const link = (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive(item.href)
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {item.icon}
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      );
    }

    return link;
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "relative flex h-screen flex-col border-r bg-card transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <HeartPulse className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">MedCore</span>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <HeartPulse className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>
        <Separator />
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-6">
            {filteredGroups.map((group) => (
              <div key={group.title}>
                {!isCollapsed && (
                  <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.title}
                  </h4>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarLink key={item.href} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>
        <Separator />
        <div className="p-3">
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={toggle}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
