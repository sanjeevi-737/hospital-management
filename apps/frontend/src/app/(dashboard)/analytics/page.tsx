"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { DollarSign, Users, Calendar, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

const weeklyData = [
  { name: "Mon", patients: 45, appointments: 38 },
  { name: "Tue", patients: 52, appointments: 45 },
  { name: "Wed", patients: 48, appointments: 40 },
  { name: "Thu", patients: 61, appointments: 50 },
  { name: "Fri", patients: 55, appointments: 48 },
  { name: "Sat", patients: 30, appointments: 25 },
  { name: "Sun", patients: 15, appointments: 10 },
];

const deptPerformance = [
  { name: "Cardiology", revenue: 35000, patients: 120 },
  { name: "Neurology", revenue: 28000, patients: 85 },
  { name: "Orthopedics", revenue: 32000, patients: 95 },
  { name: "Pediatrics", revenue: 22000, patients: 150 },
  { name: "Dermatology", revenue: 18000, patients: 70 },
];

const topDoctors = [
  { name: "Dr. Sarah Smith", specialty: "Cardiology", patients: 156, revenue: "$45,200" },
  { name: "Dr. Mike Johnson", specialty: "Neurology", patients: 128, revenue: "$38,600" },
  { name: "Dr. Emily Chen", specialty: "Pediatrics", patients: 201, revenue: "$32,100" },
  { name: "Dr. James Wilson", specialty: "Orthopedics", patients: 98, revenue: "$42,800" },
  { name: "Dr. Anna Lee", specialty: "Dermatology", patients: 145, revenue: "$28,900" },
];

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Hospital performance insights and metrics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Revenue" value="$285,400" icon={<DollarSign className="h-5 w-5" />} trend={{ value: 15, isPositive: true }} description="this quarter" />
        <StatsCard title="Total Patients" value="12,458" icon={<Users className="h-5 w-5" />} trend={{ value: 8, isPositive: true }} description="from last quarter" />
        <StatsCard title="Appointments" value="1,247" icon={<Calendar className="h-5 w-5" />} trend={{ value: 12, isPositive: true }} description="this month" />
        <StatsCard title="Satisfaction" value="94.2%" icon={<TrendingUp className="h-5 w-5" />} trend={{ value: 2, isPositive: true }} description="from last month" />
      </div>

      <RevenueChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Weekly Patient & Appointments" description="This week's statistics">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="patients" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="appointments" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Revenue by Department">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptPerformance} cx="50%" cy="50%" outerRadius={100} dataKey="revenue" label={({ name }) => name}>
                  {deptPerformance.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Top Performing Doctors">
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Doctor</th>
                <th className="text-left p-3 font-medium">Specialty</th>
                <th className="text-right p-3 font-medium">Patients</th>
                <th className="text-right p-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topDoctors.map((doc, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="p-3 font-medium">{doc.name}</td>
                  <td className="p-3 text-muted-foreground">{doc.specialty}</td>
                  <td className="p-3 text-right">{doc.patients}</td>
                  <td className="p-3 text-right font-medium">{doc.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
