"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AppointmentCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {dayNames.map((day) => (
            <div key={day} className="text-xs font-medium text-muted-foreground py-1">{day}</div>
          ))}
          {days.map((day, i) => (
            <div
              key={i}
              className={`text-sm py-2 rounded-md ${
                day === today.getDate()
                  ? "bg-primary text-primary-foreground font-bold"
                  : day
                  ? "hover:bg-accent cursor-pointer"
                  : ""
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
