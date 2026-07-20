"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, calculateAge } from "@/lib/utils";
import type { Patient } from "@/types";

interface PatientTableProps {
  data: Patient[];
  loading?: boolean;
}

export function PatientTable({ data, loading }: PatientTableProps) {
  const router = useRouter();

  const columns: Column<Patient>[] = [
    {
      id: "mrn",
      header: "MRN",
      accessorKey: "mrn",
      sortable: true,
      cell: (row) => <span className="font-mono text-sm">{row.mrn}</span>,
    },
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <div>
          <p className="font-medium">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
      sortable: true,
    },
    {
      id: "phone",
      header: "Phone",
      accessorKey: "phone",
    },
    {
      id: "gender",
      header: "Gender",
      accessorKey: "gender",
      cell: (row) => (
        <Badge variant="outline">{row.gender}</Badge>
      ),
    },
    {
      id: "age",
      header: "Age",
      cell: (row) => calculateAge(row.dateOfBirth).toString(),
    },
    {
      id: "bloodGroup",
      header: "Blood Group",
      accessorKey: "bloodGroup",
      cell: (row) => row.bloodGroup || "-",
    },
    {
      id: "createdAt",
      header: "Registered",
      cell: (row) => formatDate(row.createdAt),
      sortable: true,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      searchable
      searchPlaceholder="Search patients..."
      searchKey="firstName"
      pageSize={10}
      keyExtractor={(row) => row.id}
      onRowClick={(row) => router.push(`/patients/${row.id}`)}
      emptyTitle="No patients found"
      emptyDescription="No patients have been registered yet."
    />
  );
}
