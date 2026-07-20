import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DoctorTable } from "@/components/doctors/doctor-table";
import type { Doctor } from "@/types";

const mockDoctors: Doctor[] = [
  { id: "d1", userId: "u1", user: { id: "u1", email: "sarah@medcore.com", firstName: "Sarah", lastName: "Smith", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Cardiology", licenseNumber: "LIC-1001", departmentId: "dep1", department: { id: "dep1", name: "Cardiology", createdAt: "", updatedAt: "" }, qualification: "MD, FACC", experience: 15, consultationFee: 250, createdAt: "", updatedAt: "" },
  { id: "d2", userId: "u2", user: { id: "u2", email: "mike@medcore.com", firstName: "Mike", lastName: "Johnson", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Neurology", licenseNumber: "LIC-1002", departmentId: "dep2", department: { id: "dep2", name: "Neurology", createdAt: "", updatedAt: "" }, qualification: "MD, PhD", experience: 12, consultationFee: 300, createdAt: "", updatedAt: "" },
  { id: "d3", userId: "u3", user: { id: "u3", email: "emily@medcore.com", firstName: "Emily", lastName: "Chen", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Pediatrics", licenseNumber: "LIC-1003", departmentId: "dep3", department: { id: "dep3", name: "Pediatrics", createdAt: "", updatedAt: "" }, qualification: "MD, FAAP", experience: 8, consultationFee: 200, createdAt: "", updatedAt: "" },
  { id: "d4", userId: "u4", user: { id: "u4", email: "james@medcore.com", firstName: "James", lastName: "Wilson", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Orthopedics", licenseNumber: "LIC-1004", departmentId: "dep4", department: { id: "dep4", name: "Orthopedics", createdAt: "", updatedAt: "" }, qualification: "MD, FAAOS", experience: 20, consultationFee: 350, createdAt: "", updatedAt: "" },
];

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description="Manage doctor profiles and specializations"
      />
      <DoctorTable data={mockDoctors} />
    </div>
  );
}
