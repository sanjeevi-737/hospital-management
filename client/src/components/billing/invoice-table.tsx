import React from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { INVOICE_STATUSES } from "@/lib/constants";
import type { Invoice } from "@/types";

interface InvoiceTableProps {
  data: Invoice[];
  loading?: boolean;
}

export function InvoiceTable({ data, loading }: InvoiceTableProps) {
  const columns: Column<Invoice>[] = [
    {
      id: "invoiceNumber",
      header: "Invoice #",
      accessorKey: "invoiceNumber",
      cell: (row) => <span className="font-mono text-sm">{row.invoiceNumber}</span>,
      sortable: true,
    },
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
      id: "items",
      header: "Items",
      cell: (row) => `${row.items.length} item(s)`,
    },
    {
      id: "total",
      header: "Total",
      cell: (row) => <span className="font-medium">{formatCurrency(row.total)}</span>,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge className={INVOICE_STATUSES[row.status]?.color}>
          {INVOICE_STATUSES[row.status]?.label}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      header: "Created",
      cell: (row) => formatDate(row.createdAt),
      sortable: true,
    },
    {
      id: "dueDate",
      header: "Due Date",
      cell: (row) => row.dueDate ? formatDate(row.dueDate) : "-",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      searchable
      searchPlaceholder="Search invoices..."
      searchKey="invoiceNumber"
      pageSize={10}
      keyExtractor={(row) => row.id}
      emptyTitle="No invoices found"
      emptyDescription="No invoices have been created."
    />
  );
}
