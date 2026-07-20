import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { PatientTable } from "@/components/patients/patient-table";
import { usePatients } from "@/hooks/use-patients";
import type { Patient } from "@/types";

const mockPatients: Patient[] = [
  { id: "1", mrn: "MRN-001", firstName: "John", lastName: "Doe", email: "john@test.com", phone: "555-0101", dateOfBirth: "1990-01-15", gender: "MALE", bloodGroup: "A+", address: "123 Main St", city: "New York", state: "NY", zipCode: "10001", createdAt: "2024-01-15", updatedAt: "2024-01-15" },
  { id: "2", mrn: "MRN-002", firstName: "Jane", lastName: "Wilson", email: "jane@test.com", phone: "555-0102", dateOfBirth: "1985-05-20", gender: "FEMALE", bloodGroup: "B+", createdAt: "2024-02-10", updatedAt: "2024-02-10" },
  { id: "3", mrn: "MRN-003", firstName: "Robert", lastName: "Brown", email: "robert@test.com", phone: "555-0103", dateOfBirth: "1978-11-08", gender: "MALE", bloodGroup: "O-", createdAt: "2024-03-05", updatedAt: "2024-03-05" },
  { id: "4", mrn: "MRN-004", firstName: "Emily", lastName: "Davis", email: "emily@test.com", phone: "555-0104", dateOfBirth: "1995-03-12", gender: "FEMALE", bloodGroup: "AB+", createdAt: "2024-04-01", updatedAt: "2024-04-01" },
  { id: "5", mrn: "MRN-005", firstName: "Michael", lastName: "Garcia", email: "michael@test.com", phone: "555-0105", dateOfBirth: "1982-07-25", gender: "MALE", bloodGroup: "A-", createdAt: "2024-04-15", updatedAt: "2024-04-15" },
  { id: "6", mrn: "MRN-006", firstName: "Sarah", lastName: "Martinez", email: "sarah@test.com", phone: "555-0106", dateOfBirth: "1992-09-30", gender: "FEMALE", bloodGroup: "O+", createdAt: "2024-05-01", updatedAt: "2024-05-01" },
];

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Manage patient records and information"
      >
        <Link to="/patients/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </Link>
      </PageHeader>
      <PatientTable data={mockPatients} />
    </div>
  );
}
