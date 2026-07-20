"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Prescription } from "@/types";

interface PrescriptionListProps {
  prescriptions: Prescription[];
}

export function PrescriptionList({ prescriptions }: PrescriptionListProps) {
  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No prescriptions found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((rx) => (
        <Card key={rx.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                Dr. {rx.doctor?.user?.firstName} {rx.doctor?.user?.lastName}
              </CardTitle>
              <span className="text-xs text-muted-foreground">{formatDate(rx.createdAt)}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rx.medications.map((med, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <Badge variant="secondary" className="mt-0.5">{i + 1}</Badge>
                  <div>
                    <p className="font-medium">{med.name} - {med.dosage}</p>
                    <p className="text-muted-foreground">{med.frequency} for {med.duration}</p>
                    {med.notes && <p className="text-xs text-muted-foreground italic">{med.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
            {rx.instructions && (
              <div className="mt-3 p-3 bg-muted/50 rounded-md text-sm">
                <p className="font-medium text-xs text-muted-foreground mb-1">Instructions:</p>
                {rx.instructions}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
