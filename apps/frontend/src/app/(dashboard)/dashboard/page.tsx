"use client";

import React, { useState, useEffect } from "react";
import { Users, Calendar, DollarSign, Building2, Stethoscope, FlaskConical, Pill, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";
import { RecentPatients } from "@/components/dashboard/recent-patients";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ChartCard } from "@/components/dashboard/chart-card";
import { useAuthStore } from "@/stores/auth-store";
import { PageHeader } from "@/components/shared/page-header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const appointmentData = [
  { name: "Mon", appointments: 25 },
  { name: "Tue", appointments: 32 },
  { name: "Wed", appointments: 28 },
  { name: "Thu", appointments: 35 },
  { name: "Fri", appointments: 30 },
  { name: "Sat", appointments: 15 },
  { name: "Sun", appointments: 8 },
];

const departmentData = [
  { name: "Cardiology", value: 30, color: "#2563eb" },
  { name: "Neurology", value: 20, color: "#10b981" },
  { name: "Orthopedics", value: 25, color: "#f59e0b" },
  { name: "Pediatrics", value: 15, color: "#ef4444" },
  { name: "Others", value: 10, color: "#8b5cf6" },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${user?.firstName || "User"}!`}
        description="Here's what's happening at your hospital today."
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Patients"
          value="12,458"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
          description="from last month"
        />
        <StatsCard
          title="Today's Appointments"
          value="48"
          icon={<Calendar className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
          description="from yesterday"
        />
        <StatsCard
          title="Monthly Revenue"
          value="$85,200"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 15, isPositive: true }}
          description="from last month"
        />
        <StatsCard
          title="Active Doctors"
          value="124"
          icon={<Stethoscope className="h-5 w-5" />}
          description="across all departments"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Departments"
          value="18"
          icon={<Building2 className="h-5 w-5" />}
        />
        <StatsCard
          title="Lab Orders Pending"
          value="23"
          icon={<FlaskConical className="h-5 w-5" />}
          description="awaiting results"
        />
        <StatsCard
          title="Prescriptions Today"
          value="67"
          icon={<Pill className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Low Stock Items"
          value="8"
          icon={<AlertTriangle className="h-5 w-5" />}
          description="need restocking"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <ChartCard title="Patient Demographics">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: dept.color }} />
                    <span className="text-muted-foreground">{dept.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <ChartCard title="Appointments This Week" description="Daily appointment count">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="appointments" fill="hsl(221.2 83.2% 53.3%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <RecentAppointments />
      </div>

      <RecentPatients />
    </div>
  );
}
