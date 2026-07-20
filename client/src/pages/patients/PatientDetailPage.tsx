import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { PatientProfile } from "@/components/patients/patient-profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePatient } from "@/hooks/use-patients";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function PatientDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.id as string;
  const { data: patient, isLoading } = usePatient(patientId);

  if (isLoading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Details">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </PageHeader>

      {patient && <PatientProfile patient={patient} />}

      {!patient && !isLoading && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Patient not found.
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Latest Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Blood Pressure</span><span>120/80 mmHg</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Heart Rate</span><span>72 bpm</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Temperature</span><span>98.6°F</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">O2 Saturation</span><span>98%</span></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Insurance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Provider</span><span>{mockPatient.insuranceProvider}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ID</span><span>{mockPatient.insuranceId}</span></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{mockPatient.emergencyContact}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{mockPatient.emergencyPhone}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
          {mockPatient.allergies && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="destructive">{mockPatient.allergies}</Badge>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Appointment history will appear here.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Medical records will appear here.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Prescriptions will appear here.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Billing history will appear here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const mockPatient = {
  insuranceProvider: "Blue Cross Blue Shield",
  insuranceId: "BCBS-12345",
  emergencyContact: "Mary Doe",
  emergencyPhone: "555-9999",
  allergies: "Penicillin, Shellfish",
};
