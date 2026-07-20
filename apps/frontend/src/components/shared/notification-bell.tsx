"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore } from "@/stores/notification-store";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  onClick?: () => void;
  className?: string;
}

export function NotificationBell({ onClick, className }: NotificationBellProps) {
  const { unreadCount } = useNotificationStore();

  return (
    <Button variant="ghost" size="icon" className={cn("relative", className)} onClick={onClick} aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}>
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full px-1 text-[10px] flex items-center justify-center"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  );
}
