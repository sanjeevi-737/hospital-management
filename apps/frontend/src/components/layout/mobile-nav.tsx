"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  X,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useSidebarStore } from "@/stores/sidebar-store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Patients", href: "/patients", icon: <Users className="h-5 w-5" /> },
  { label: "Doctors", href: "/doctors", icon: <Stethoscope className="h-5 w-5" /> },
  { label: "Appointments", href: "/appointments", icon: <Calendar className="h-5 w-5" /> },
  { label: "Medical Records", href: "/medical-records", icon: <FileText className="h-5 w-5" /> },
  { label: "Prescriptions", href: "/prescriptions", icon: <Pill className="h-5 w-5" /> },
  { label: "Pharmacy", href: "/pharmacy", icon: <HeartPulse className="h-5 w-5" /> },
  { label: "Laboratory", href: "/laboratory", icon: <FlaskConical className="h-5 w-5" /> },
  { label: "Billing", href: "/billing", icon: <Receipt className="h-5 w-5" /> },
  { label: "Departments", href: "/departments", icon: <Building2 className="h-5 w-5" /> },
  { label: "Analytics", href: "/analytics", icon: <BarChart3 className="h-5 w-5" /> },
  { label: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
];

export function MobileNav() {
  const pathname = usePathname();
  const { isMobileOpen, setMobileOpen } = useSidebarStore();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <HeartPulse className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">MedCore</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
