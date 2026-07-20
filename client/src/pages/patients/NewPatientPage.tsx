import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { PatientForm } from "@/components/patients/patient-form";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function NewPatientPage() {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    toast.success("Patient created successfully");
    navigate("/patients");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add New Patient">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="p-6">
          <PatientForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
