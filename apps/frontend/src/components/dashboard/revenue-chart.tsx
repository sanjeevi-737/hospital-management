"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "./chart-card";

const revenueData = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 35000 },
  { month: "Mar", revenue: 48000, expenses: 33000 },
  { month: "Apr", revenue: 61000, expenses: 38000 },
  { month: "May", revenue: 55000, expenses: 36000 },
  { month: "Jun", revenue: 67000, expenses: 40000 },
  { month: "Jul", revenue: 72000, expenses: 42000 },
  { month: "Aug", revenue: 69000, expenses: 41000 },
  { month: "Sep", revenue: 75000, expenses: 43000 },
  { month: "Oct", revenue: 81000, expenses: 45000 },
  { month: "Nov", revenue: 78000, expenses: 44000 },
  { month: "Dec", revenue: 85000, expenses: 47000 },
];

export function RevenueChart() {
  return (
    <ChartCard title="Revenue Overview" description="Monthly revenue vs expenses">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Area type="monotone" dataKey="revenue" stroke="hsl(221.2 83.2% 53.3%)" fill="hsl(221.2 83.2% 53.3%)" fillOpacity={0.1} />
            <Area type="monotone" dataKey="expenses" stroke="hsl(0 84.2% 60.2%)" fill="hsl(0 84.2% 60.2%)" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
