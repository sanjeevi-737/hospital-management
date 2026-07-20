"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials, formatDate, calculateAge } from "@/lib/utils";
import type { Patient } from "@/types";

const mockPatients: Patient[] = [
  { id: "1", mrn: "MRN-001", firstName: "John", lastName: "Doe", email: "john@test.com", phone: "555-0101", dateOfBirth: "1990-01-01", gender: "MALE", createdAt: "", updatedAt: "" },
  { id: "2", mrn: "MRN-002", firstName: "Jane", lastName: "Wilson", email: "jane@test.com", phone: "555-0102", dateOfBirth: "1985-05-15", gender: "FEMALE", createdAt: "", updatedAt: "" },
  { id: "3", mrn: "MRN-003", firstName: "Robert", lastName: "Brown", email: "robert@test.com", phone: "555-0103", dateOfBirth: "1978-11-20", gender: "MALE", createdAt: "", updatedAt: "" },
  { id: "4", mrn: "MRN-004", firstName: "Emily", lastName: "Davis", email: "emily@test.com", phone: "555-0104", dateOfBirth: "1995-03-08", gender: "FEMALE", createdAt: "", updatedAt: "" },
];

export function RecentPatients() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Recent Patients</CardTitle>
          <Link href="/patients" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockPatients.map((patient) => (
            <div key={patient.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs">
                    {getInitials(patient.firstName, patient.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {patient.mrn} &middot; Age {calculateAge(patient.dateOfBirth)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{patient.gender}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
