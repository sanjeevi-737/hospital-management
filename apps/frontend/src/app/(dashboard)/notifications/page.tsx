"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, CheckCheck } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const initialNotifications = [
  { id: "1", title: "New Appointment Scheduled", message: "John Doe has an appointment with Dr. Smith at 2:00 PM today.", type: "APPOINTMENT", read: false, createdAt: "2025-01-15T10:30:00Z" },
  { id: "2", title: "Lab Results Ready", message: "Lab results for Jane Wilson (CBC) are now available.", type: "LAB_RESULT", read: false, createdAt: "2025-01-15T09:15:00Z" },
  { id: "3", title: "Payment Received", message: "Payment of $370 received for Invoice #INV-2025-001.", type: "BILLING", read: true, createdAt: "2025-01-15T08:00:00Z" },
  { id: "4", title: "Low Stock Alert", message: "Cetirizine (10mg) is running low. Only 15 units remaining.", type: "WARNING", read: false, createdAt: "2025-01-14T16:00:00Z" },
  { id: "5", title: "System Update", message: "MedCore HMS will undergo maintenance tonight from 11 PM to 1 AM.", type: "INFO", read: true, createdAt: "2025-01-14T10:00:00Z" },
];

const typeColors: Record<string, string> = {
  APPOINTMENT: "bg-blue-100 text-blue-800",
  LAB_RESULT: "bg-emerald-100 text-emerald-800",
  BILLING: "bg-purple-100 text-purple-800",
  WARNING: "bg-amber-100 text-amber-800",
  INFO: "bg-sky-100 text-sky-800",
  SUCCESS: "bg-emerald-100 text-emerald-800",
  ERROR: "bg-red-100 text-red-800",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications">
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <CheckCheck className="h-4 w-4 mr-2" />
          Mark All Read
        </Button>
      </PageHeader>

      <div className="space-y-2">
        {notifications.map((notif) => (
          <Card key={notif.id} className={`transition-colors ${!notif.read ? "bg-primary/5 border-primary/20" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 rounded-full p-2 ${typeColors[notif.type] || "bg-gray-100 text-gray-800"}`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">{notif.title}</h4>
                    {!notif.read && <Badge className="h-4 min-w-[16px] px-1 text-[10px]">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(notif.createdAt)}</p>
                </div>
                {!notif.read && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => markRead(notif.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
