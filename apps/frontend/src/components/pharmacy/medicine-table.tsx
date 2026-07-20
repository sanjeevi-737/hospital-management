"use client";

import React from "react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Medicine } from "@/types";

interface MedicineTableProps {
  data: Medicine[];
  loading?: boolean;
}

export function MedicineTable({ data, loading }: MedicineTableProps) {
  const getStockColor = (qty: number, min: number) => {
    if (qty < min * 0.5) return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950";
    if (qty < min) return "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950";
    return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950";
  };

  const columns: Column<Medicine>[] = [
    {
      id: "name",
      header: "Medicine",
      cell: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          {row.genericName && <p className="text-xs text-muted-foreground">{row.genericName}</p>}
        </div>
      ),
      sortable: true,
    },
    {
      id: "category",
      header: "Category",
      accessorKey: "category",
      cell: (row) => <Badge variant="secondary">{row.category}</Badge>,
    },
    {
      id: "dosageForm",
      header: "Form",
      cell: (row) => `${row.dosageForm} (${row.strength})`,
    },
    {
      id: "quantity",
      header: "Stock",
      cell: (row) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStockColor(row.quantity, row.minStockLevel)}`}>
          {row.quantity} units
        </span>
      ),
      sortable: true,
    },
    {
      id: "price",
      header: "Price",
      cell: (row) => formatCurrency(row.unitPrice),
      sortable: true,
    },
    {
      id: "expiryDate",
      header: "Expiry",
      cell: (row) => formatDate(row.expiryDate),
    },
    {
      id: "batchNumber",
      header: "Batch",
      cell: (row) => row.batchNumber || "-",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      searchable
      searchPlaceholder="Search medicines..."
      searchKey="name"
      pageSize={10}
      keyExtractor={(row) => row.id}
      emptyTitle="No medicines found"
      emptyDescription="No medicines in the inventory."
    />
  );
}
