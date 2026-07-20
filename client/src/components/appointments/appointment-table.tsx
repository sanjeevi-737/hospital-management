import React from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import type { Appointment } from "@/types";

interface AppointmentTableProps {
  data: Appointment[];
  loading?: boolean;
}

export function AppointmentTable({ data, loading }: AppointmentTableProps) {
  const router = useNavigate();

  const columns: Column<Appointment>[] = [
    {
      id: "patient",
      header: "Patient",
      cell: (row) => (
        <div>
          <p className="font-medium">{row.patient?.firstName} {row.patient?.lastName}</p>
          <p className="text-xs text-muted-foreground">{row.patient?.mrn}</p>
        </div>
      ),
    },
    {
      id: "doctor",
      header: "Doctor",
      cell: (row) => `Dr. ${row.doctor?.user?.firstName} ${row.doctor?.user?.lastName}`,
    },
    {
      id: "date",
      header: "Date",
      cell: (row) => formatDate(row.appointmentDate, "MMM dd, yyyy"),
      sortable: true,
    },
    {
      id: "time",
      header: "Time",
      accessorKey: "appointmentTime",
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      cell: (row) => <Badge variant="outline">{row.type.replace("_", " ")}</Badge>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge className={APPOINTMENT_STATUSES[row.status]?.color}>
          {APPOINTMENT_STATUSES[row.status]?.label}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      searchable
      searchPlaceholder="Search appointments..."
      searchKey="reason"
      pageSize={10}
      keyExtractor={(row) => row.id}
      onRowClick={(row) => {}}
      emptyTitle="No appointments found"
      emptyDescription="No appointments have been scheduled."
    />
  );
}
