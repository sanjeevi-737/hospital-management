"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitials, formatDate, calculateAge, formatCurrency } from "@/lib/utils";
import type { Patient } from "@/types";

interface PatientProfileProps {
  patient: Patient;
}

export function PatientProfile({ patient }: PatientProfileProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={patient.avatar} />
              <AvatarFallback className="text-lg">
                {getInitials(patient.firstName, patient.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{patient.firstName} {patient.lastName}</h2>
                <Badge variant="outline">{patient.mrn}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{formatDate(patient.dateOfBirth)} (Age {calculateAge(patient.dateOfBirth)})</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium">{patient.gender}</p>
                </div>
                {patient.bloodGroup && (
                  <div>
                    <p className="text-muted-foreground">Blood Group</p>
                    <p className="font-medium">{patient.bloodGroup}</p>
                  </div>
                )}
                {patient.address && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">{patient.address}{patient.city ? `, ${patient.city}` : ""}{patient.state ? `, ${patient.state}` : ""} {patient.zipCode || ""}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
