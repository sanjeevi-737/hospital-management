"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials, formatRelativeTime } from "@/lib/utils";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import type { Appointment } from "@/types";

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "p1",
    patient: { id: "p1", mrn: "MRN-001", firstName: "John", lastName: "Doe", email: "john@test.com", phone: "555-0101", dateOfBirth: "1990-01-01", gender: "MALE", createdAt: "", updatedAt: "" },
    doctorId: "d1",
    doctor: { id: "d1", userId: "u1", user: { id: "u1", email: "dr@test.com", firstName: "Sarah", lastName: "Smith", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Cardiology", licenseNumber: "LIC-001", departmentId: "dep1", createdAt: "", updatedAt: "" },
    appointmentDate: new Date().toISOString(),
    appointmentTime: "09:00",
    status: "CONFIRMED",
    type: "SCHEDULED",
    reason: "Routine checkup",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    patientId: "p2",
    patient: { id: "p2", mrn: "MRN-002", firstName: "Jane", lastName: "Wilson", email: "jane@test.com", phone: "555-0102", dateOfBirth: "1985-05-15", gender: "FEMALE", createdAt: "", updatedAt: "" },
    doctorId: "d2",
    doctor: { id: "d2", userId: "u2", user: { id: "u2", email: "dr2@test.com", firstName: "Mike", lastName: "Johnson", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Neurology", licenseNumber: "LIC-002", departmentId: "dep2", createdAt: "", updatedAt: "" },
    appointmentDate: new Date().toISOString(),
    appointmentTime: "10:30",
    status: "SCHEDULED",
    type: "FOLLOW_UP",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    patientId: "p3",
    patient: { id: "p3", mrn: "MRN-003", firstName: "Robert", lastName: "Brown", email: "robert@test.com", phone: "555-0103", dateOfBirth: "1978-11-20", gender: "MALE", createdAt: "", updatedAt: "" },
    doctorId: "d1",
    doctor: { id: "d1", userId: "u1", user: { id: "u1", email: "dr@test.com", firstName: "Sarah", lastName: "Smith", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Cardiology", licenseNumber: "LIC-001", departmentId: "dep1", createdAt: "", updatedAt: "" },
    appointmentDate: new Date().toISOString(),
    appointmentTime: "11:00",
    status: "COMPLETED",
    type: "WALK_IN",
    createdAt: "",
    updatedAt: "",
  },
];

export function RecentAppointments() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recent Appointments</CardTitle>
          <Link href="/appointments" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAppointments.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs">
                    {apt.patient ? getInitials(apt.patient.firstName, apt.patient.lastName) : "P"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {apt.patient?.firstName} {apt.patient?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName} &middot; {apt.appointmentTime}
                  </p>
                </div>
              </div>
              <Badge className={APPOINTMENT_STATUSES[apt.status]?.color}>
                {APPOINTMENT_STATUSES[apt.status]?.label}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
