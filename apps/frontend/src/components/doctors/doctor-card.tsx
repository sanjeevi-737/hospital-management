"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatCurrency } from "@/lib/utils";
import type { Doctor } from "@/types";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => router.push(`/doctors/${doctor.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg">
              {getInitials(doctor.user.firstName, doctor.user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">
              Dr. {doctor.user.firstName} {doctor.user.lastName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Department</span>
            <span>{doctor.department?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Experience</span>
            <span>{doctor.experience || 0} years</span>
          </div>
          {doctor.consultationFee && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-medium">{formatCurrency(doctor.consultationFee)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">License</span>
            <Badge variant="outline">{doctor.licenseNumber}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
