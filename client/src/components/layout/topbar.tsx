import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, User, Settings, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { NotificationBell } from "@/components/shared/notification-bell";
import { useAuthStore } from "@/stores/auth-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { getInitials } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

export function Topbar() {
  const { user, logout } = useAuthStore();
  const { setMobileOpen } = useSidebarStore();
  const { theme, setTheme } = useTheme();
  const router = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router(ROUTES.LOGIN);
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <Button
            variant="outline"
            className="hidden md:flex h-9 w-64 justify-start text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <span className="mr-2">🔍</span>
            Search...
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell onClick={() => router(ROUTES.NOTIFICATIONS)} />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar} alt={user?.firstName} />
                  <AvatarFallback>
                    {user ? getInitials(user.firstName, user.lastName) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {user?.role}
                    </span>
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={ROUTES.SETTINGS}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={ROUTES.SETTINGS}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem
              onSelect={() => {
                router(ROUTES.PATIENTS);
                setSearchOpen(false);
              }}
            >
              Patients
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router(ROUTES.DOCTORS);
                setSearchOpen(false);
              }}
            >
              Doctors
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router(ROUTES.APPOINTMENTS);
                setSearchOpen(false);
              }}
            >
              Appointments
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router(ROUTES.PHARMACY);
                setSearchOpen(false);
              }}
            >
              Pharmacy
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router(ROUTES.LABORATORY);
                setSearchOpen(false);
              }}
            >
              Laboratory
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router(ROUTES.BILLING);
                setSearchOpen(false);
              }}
            >
              Billing
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
