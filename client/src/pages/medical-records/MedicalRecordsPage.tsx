import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const mockRecords = [
  { id: "1", patientName: "John Doe", mrn: "MRN-001", doctorName: "Dr. Sarah Smith", diagnosis: "Hypertension Stage 2", date: "2025-01-15", status: "Active" },
  { id: "2", patientName: "Jane Wilson", mrn: "MRN-002", doctorName: "Dr. Mike Johnson", diagnosis: "Migraine with aura", date: "2025-01-14", status: "Active" },
  { id: "3", patientName: "Robert Brown", mrn: "MRN-003", doctorName: "Dr. Sarah Smith", diagnosis: "Annual Physical Exam", date: "2025-01-13", status: "Completed" },
  { id: "4", patientName: "Emily Davis", mrn: "MRN-004", doctorName: "Dr. Emily Chen", diagnosis: "Common Cold", date: "2025-01-12", status: "Completed" },
];

export default function MedicalRecordsPage() {
  const columns: Column<typeof mockRecords[0]>[] = [
    { id: "patient", header: "Patient", cell: (row) => <div><p className="font-medium">{row.patientName}</p><p className="text-xs text-muted-foreground">{row.mrn}</p></div> },
    { id: "doctor", header: "Doctor", cell: (row) => row.doctorName, sortable: true },
    { id: "diagnosis", header: "Diagnosis", cell: (row) => row.diagnosis, sortable: true },
    { id: "date", header: "Date", cell: (row) => formatDate(row.date), sortable: true },
    { id: "status", header: "Status", cell: (row) => <Badge variant={row.status === "Active" ? "info" : "secondary"}>{row.status}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Medical Records" description="Patient medical history and records" />
      <DataTable columns={columns} data={mockRecords} searchable searchPlaceholder="Search records..." keyExtractor={(row) => row.id} emptyTitle="No records found" />
    </div>
  );
}
