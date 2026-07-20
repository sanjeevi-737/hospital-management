import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

const departments = [
  { id: "1", name: "Cardiology", description: "Heart and cardiovascular system", doctors: 12, location: "Building A, Floor 3", phone: "555-3001" },
  { id: "2", name: "Neurology", description: "Brain and nervous system", doctors: 8, location: "Building A, Floor 4", phone: "555-3002" },
  { id: "3", name: "Pediatrics", description: "Medical care for infants, children, and adolescents", doctors: 10, location: "Building B, Floor 1", phone: "555-3003" },
  { id: "4", name: "Orthopedics", description: "Musculoskeletal system", doctors: 7, location: "Building B, Floor 2", phone: "555-3004" },
  { id: "5", name: "Dermatology", description: "Skin, hair, and nails", doctors: 5, location: "Building C, Floor 1", phone: "555-3005" },
  { id: "6", name: "Ophthalmology", description: "Eye care and vision", doctors: 4, location: "Building C, Floor 2", phone: "555-3006" },
  { id: "7", name: "Radiology", description: "Medical imaging diagnostics", doctors: 6, location: "Building A, Floor 1", phone: "555-3007" },
  { id: "8", name: "Emergency Medicine", description: "Acute care and emergency treatment", doctors: 15, location: "Emergency Wing", phone: "555-3008" },
];

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Departments" description="Hospital departments overview" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{dept.name}</CardTitle>
                <Badge variant="secondary">{dept.doctors} doctors</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{dept.description}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span>{dept.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{dept.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
