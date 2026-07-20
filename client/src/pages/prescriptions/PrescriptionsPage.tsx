import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { PrescriptionList } from "@/components/prescriptions/prescription-list";
import type { Prescription } from "@/types";

const mockPrescriptions: Prescription[] = [
  {
    id: "1", patientId: "p1", doctorId: "d1",
    doctor: { id: "d1", userId: "u1", user: { id: "u1", email: "dr@test.com", firstName: "Sarah", lastName: "Smith", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Cardiology", licenseNumber: "LIC-001", departmentId: "dep1", createdAt: "", updatedAt: "" },
    patient: { id: "p1", mrn: "MRN-001", firstName: "John", lastName: "Doe", email: "john@test.com", phone: "555-0101", dateOfBirth: "1990-01-01", gender: "MALE", createdAt: "", updatedAt: "" },
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days", notes: "Take in the morning" },
      { name: "Aspirin", dosage: "81mg", frequency: "Once daily", duration: "30 days" },
    ],
    instructions: "Monitor blood pressure regularly. Follow up in 2 weeks.",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
  },
  {
    id: "2", patientId: "p2", doctorId: "d2",
    doctor: { id: "d2", userId: "u2", user: { id: "u2", email: "dr2@test.com", firstName: "Mike", lastName: "Johnson", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Neurology", licenseNumber: "LIC-002", departmentId: "dep2", createdAt: "", updatedAt: "" },
    patient: { id: "p2", mrn: "MRN-002", firstName: "Jane", lastName: "Wilson", email: "jane@test.com", phone: "555-0102", dateOfBirth: "1985-05-15", gender: "FEMALE", createdAt: "", updatedAt: "" },
    medications: [
      { name: "Sumatriptan", dosage: "50mg", frequency: "As needed", duration: "10 tablets", notes: "Take at onset of migraine" },
      { name: "Ibuprofen", dosage: "400mg", frequency: "Every 6 hours as needed", duration: "7 days" },
    ],
    instructions: "Avoid triggers: bright lights, stress, certain foods.",
    createdAt: "2025-01-14",
    updatedAt: "2025-01-14",
  },
];

export default function PrescriptionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" description="Manage patient prescriptions" />
      <PrescriptionList prescriptions={mockPrescriptions} />
    </div>
  );
}
