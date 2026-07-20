import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { InvoiceTable } from "@/components/billing/invoice-table";
import { InvoiceForm } from "@/components/billing/invoice-form";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Invoice } from "@/types";

const mockInvoices: Invoice[] = [
  { id: "1", invoiceNumber: "INV-2025-001", patientId: "p1", patient: { id: "p1", mrn: "MRN-001", firstName: "John", lastName: "Doe", email: "john@test.com", phone: "555-0101", dateOfBirth: "1990-01-01", gender: "MALE", createdAt: "", updatedAt: "" }, items: [{ description: "Consultation Fee", quantity: 1, unitPrice: 250, total: 250 }, { description: "Blood Test", quantity: 1, unitPrice: 120, total: 120 }], subtotal: 370, tax: 0, discount: 0, total: 370, status: "PAID", paidAt: "2025-01-15", createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "2", invoiceNumber: "INV-2025-002", patientId: "p2", patient: { id: "p2", mrn: "MRN-002", firstName: "Jane", lastName: "Wilson", email: "jane@test.com", phone: "555-0102", dateOfBirth: "1985-05-15", gender: "FEMALE", createdAt: "", updatedAt: "" }, items: [{ description: "MRI Brain", quantity: 1, unitPrice: 1200, total: 1200 }, { description: "Consultation Fee", quantity: 1, unitPrice: 300, total: 300 }], subtotal: 1500, tax: 0, discount: 0, total: 1500, status: "PENDING", dueDate: "2025-02-15", createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "3", invoiceNumber: "INV-2025-003", patientId: "p3", patient: { id: "p3", mrn: "MRN-003", firstName: "Robert", lastName: "Brown", email: "robert@test.com", phone: "555-0103", dateOfBirth: "1978-11-20", gender: "MALE", createdAt: "", updatedAt: "" }, items: [{ description: "Annual Physical", quantity: 1, unitPrice: 500, total: 500 }, { description: "Lab Work", quantity: 1, unitPrice: 200, total: 200 }, { description: "EKG", quantity: 1, unitPrice: 150, total: 150 }], subtotal: 850, tax: 0, discount: 50, total: 800, status: "PARTIAL", dueDate: "2025-02-01", createdAt: "2025-01-13", updatedAt: "2025-01-13" },
];

export default function BillingPage() {
  const [addOpen, setAddOpen] = useState(false);
  const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const paid = mockInvoices.filter(i => i.status === "PAID").length;
  const pending = mockInvoices.filter(i => i.status === "PENDING" || i.status === "PARTIAL").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description="Invoice and payment management">
        <Button onClick={() => setAddOpen(true)}>New Invoice</Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} trend={{ value: 12, isPositive: true }} description="this month" />
        <StatsCard title="Invoices" value={mockInvoices.length} icon={<CheckCircle className="h-5 w-5" />} />
        <StatsCard title="Paid" value={paid} icon={<CheckCircle className="h-5 w-5" />} />
        <StatsCard title="Pending" value={pending} icon={<Clock className="h-5 w-5" />} />
      </div>

      <InvoiceTable data={mockInvoices} />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceForm
            patients={[{ id: "p1", firstName: "John", lastName: "Doe" }, { id: "p2", firstName: "Jane", lastName: "Wilson" }]}
            onSubmit={(data) => {
              toast.success("Invoice created successfully");
              setAddOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
