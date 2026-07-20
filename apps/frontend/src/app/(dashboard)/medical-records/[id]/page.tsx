"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function MedicalRecordDetailPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader title="Medical Record">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Record #MR-2025-001</CardTitle>
            <Badge variant="info">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p className="text-muted-foreground">Patient</p><p className="font-medium">John Doe</p></div>
            <div><p className="text-muted-foreground">Doctor</p><p className="font-medium">Dr. Sarah Smith</p></div>
            <div><p className="text-muted-foreground">Date</p><p className="font-medium">{formatDate("2025-01-15")}</p></div>
            <div><p className="text-muted-foreground">Diagnosis</p><p className="font-medium">Hypertension Stage 2</p></div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Symptoms</h4>
            <p className="text-sm text-muted-foreground">Elevated blood pressure readings over the past two weeks, occasional headaches, mild dizziness upon standing.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Treatment Plan</h4>
            <p className="text-sm text-muted-foreground">Prescribed Lisinopril 10mg daily. Lifestyle modifications recommended including low-sodium diet and regular exercise. Follow-up in 2 weeks.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Vitals</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="rounded-lg bg-muted p-3"><p className="text-muted-foreground">Blood Pressure</p><p className="font-bold text-lg">145/92</p></div>
              <div className="rounded-lg bg-muted p-3"><p className="text-muted-foreground">Heart Rate</p><p className="font-bold text-lg">78 bpm</p></div>
              <div className="rounded-lg bg-muted p-3"><p className="text-muted-foreground">Temperature</p><p className="font-bold text-lg">98.4°F</p></div>
              <div className="rounded-lg bg-muted p-3"><p className="text-muted-foreground">Weight</p><p className="font-bold text-lg">185 lbs</p></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
