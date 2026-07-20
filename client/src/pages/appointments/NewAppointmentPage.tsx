import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const mockPatients = [
  { id: "p1", firstName: "John", lastName: "Doe" },
  { id: "p2", firstName: "Jane", lastName: "Wilson" },
  { id: "p3", firstName: "Robert", lastName: "Brown" },
];

const mockDoctors = [
  { id: "d1", user: { firstName: "Sarah", lastName: "Smith" }, specialization: "Cardiology" },
  { id: "d2", user: { firstName: "Mike", lastName: "Johnson" }, specialization: "Neurology" },
];

export default function NewAppointmentPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader title="New Appointment">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="p-6">
          <AppointmentForm
            patients={mockPatients}
            doctors={mockDoctors}
            onSubmit={(data) => {
              toast.success("Appointment scheduled successfully");
              navigate("/appointments");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
