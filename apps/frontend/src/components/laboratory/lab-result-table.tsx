"use client";

import React from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { LAB_ORDER_STATUSES } from "@/lib/constants";
import type { LabOrder } from "@/types";

interface LabResultTableProps {
  data: LabOrder[];
  loading?: boolean;
}

export function LabResultTable({ data, loading }: LabResultTableProps) {
  const columns: Column<LabOrder>[] = [
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
      id: "testName",
      header: "Test",
      cell: (row) => (
        <div>
          <p className="font-medium">{row.testName}</p>
          <p className="text-xs text-muted-foreground">{row.testType}</p>
        </div>
      ),
      sortable: true,
    },
    {
      id: "doctor",
      header: "Ordered By",
      cell: (row) => `Dr. ${row.doctor?.user?.firstName} ${row.doctor?.user?.lastName}`,
    },
    {
      id: "priority",
      header: "Priority",
      cell: (row) => (
        <Badge variant={row.priority === "STAT" ? "destructive" : row.priority === "URGENT" ? "warning" : "outline"}>
          {row.priority}
        </Badge>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge className={LAB_ORDER_STATUSES[row.status]?.color}>
          {LAB_ORDER_STATUSES[row.status]?.label}
        </Badge>
      ),
    },
    {
      id: "orderDate",
      header: "Ordered",
      cell: (row) => formatDate(row.orderDate),
      sortable: true,
    },
    {
      id: "result",
      header: "Result",
      cell: (row) => row.result ? (
        <Badge variant="success" className="max-w-[200px] truncate">{row.result}</Badge>
      ) : (
        <span className="text-muted-foreground">Pending</span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      searchable
      searchPlaceholder="Search lab orders..."
      searchKey="testName"
      pageSize={10}
      keyExtractor={(row) => row.id}
      emptyTitle="No lab orders found"
      emptyDescription="No lab orders have been placed."
    />
  );
}
