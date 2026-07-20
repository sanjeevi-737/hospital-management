"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatCurrency } from "@/lib/utils";
import type { Doctor } from "@/types";

interface DoctorTableProps {
  data: Doctor[];
  loading?: boolean;
}

export function DoctorTable({ data, loading }: DoctorTableProps) {
  const router = useRouter();

  const columns: Column<Doctor>[] = [
    {
      id: "name",
      header: "Doctor",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
            {getInitials(row.user.firstName, row.user.lastName)}
          </div>
          <div>
            <p className="font-medium">Dr. {row.user.firstName} {row.user.lastName}</p>
            <p className="text-xs text-muted-foreground">{row.user.email}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "specialization",
      header: "Specialization",
      accessorKey: "specialization",
      cell: (row) => <Badge variant="secondary">{row.specialization}</Badge>,
      sortable: true,
    },
    {
      id: "department",
      header: "Department",
      cell: (row) => row.department?.name || "N/A",
    },
    {
      id: "experience",
      header: "Experience",
      cell: (row) => `${row.experience || 0} years`,
    },
    {
      id: "fee",
      header: "Fee",
      cell: (row) => row.consultationFee ? formatCurrency(row.consultationFee) : "N/A",
    },
    {
      id: "license",
      header: "License",
      accessorKey: "licenseNumber",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      searchable
      searchPlaceholder="Search doctors..."
      searchKey="specialization"
      pageSize={10}
      keyExtractor={(row) => row.id}
      onRowClick={(row) => router.push(`/doctors/${row.id}`)}
      emptyTitle="No doctors found"
      emptyDescription="No doctors are currently registered."
    />
  );
}
