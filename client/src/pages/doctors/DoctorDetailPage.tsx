import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatCurrency } from "@/lib/utils";

const mockDoctor = {
  id: "d1",
  user: { firstName: "Sarah", lastName: "Smith", email: "sarah@medcore.com", phone: "555-1001" },
  specialization: "Cardiology",
  licenseNumber: "LIC-1001",
  department: { name: "Cardiology" },
  qualification: "MD, FACC",
  experience: 15,
  consultationFee: 250,
  bio: "Dr. Sarah Smith is a board-certified cardiologist with 15 years of experience in interventional cardiology and heart failure management.",
  availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  availableFrom: "09:00",
  availableTo: "17:00",
};

export default function DoctorDetailPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Profile">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {getInitials(mockDoctor.user.firstName, mockDoctor.user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">Dr. {mockDoctor.user.firstName} {mockDoctor.user.lastName}</h2>
                <Badge variant="secondary">{mockDoctor.specialization}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{mockDoctor.bio}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">{mockDoctor.department.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Experience</p>
                  <p className="font-medium">{mockDoctor.experience} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fee</p>
                  <p className="font-medium">{formatCurrency(mockDoctor.consultationFee)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">License</p>
                  <p className="font-medium">{mockDoctor.licenseNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days</span>
                <span>{mockDoctor.availableDays.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hours</span>
                <span>{mockDoctor.availableFrom} - {mockDoctor.availableTo}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{mockDoctor.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span>{mockDoctor.user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Qualification</span>
                <span>{mockDoctor.qualification}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
