import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LabResultTable } from "@/components/laboratory/lab-result-table";
import { LabOrderForm } from "@/components/laboratory/lab-order-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatsCard } from "@/components/dashboard/stats-card";
import { FlaskConical, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { LabOrder } from "@/types";

const mockOrders: LabOrder[] = [
  { id: "1", patientId: "p1", patient: { id: "p1", mrn: "MRN-001", firstName: "John", lastName: "Doe", email: "john@test.com", phone: "555-0101", dateOfBirth: "1990-01-01", gender: "MALE", createdAt: "", updatedAt: "" }, doctorId: "d1", doctor: { id: "d1", userId: "u1", user: { id: "u1", email: "dr@test.com", firstName: "Sarah", lastName: "Smith", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Cardiology", licenseNumber: "LIC-001", departmentId: "dep1", createdAt: "", updatedAt: "" }, testType: "Blood Test", testName: "Complete Blood Count (CBC)", status: "COMPLETED", priority: "ROUTINE", result: "All values within normal range", orderDate: "2025-01-14", resultDate: "2025-01-15", createdAt: "", updatedAt: "" },
  { id: "2", patientId: "p2", patient: { id: "p2", mrn: "MRN-002", firstName: "Jane", lastName: "Wilson", email: "jane@test.com", phone: "555-0102", dateOfBirth: "1985-05-15", gender: "FEMALE", createdAt: "", updatedAt: "" }, doctorId: "d2", doctor: { id: "d2", userId: "u2", user: { id: "u2", email: "dr2@test.com", firstName: "Mike", lastName: "Johnson", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Neurology", licenseNumber: "LIC-002", departmentId: "dep2", createdAt: "", updatedAt: "" }, testType: "Imaging", testName: "MRI Brain", status: "PENDING", priority: "URGENT", orderDate: "2025-01-15", createdAt: "", updatedAt: "" },
  { id: "3", patientId: "p3", patient: { id: "p3", mrn: "MRN-003", firstName: "Robert", lastName: "Brown", email: "robert@test.com", phone: "555-0103", dateOfBirth: "1978-11-20", gender: "MALE", createdAt: "", updatedAt: "" }, doctorId: "d1", doctor: { id: "d1", userId: "u1", user: { id: "u1", email: "dr@test.com", firstName: "Sarah", lastName: "Smith", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Cardiology", licenseNumber: "LIC-001", departmentId: "dep1", createdAt: "", updatedAt: "" }, testType: "Blood Test", testName: "Lipid Panel", status: "IN_PROGRESS", priority: "ROUTINE", orderDate: "2025-01-15", createdAt: "", updatedAt: "" },
];

export default function LaboratoryPage() {
  const [addOpen, setAddOpen] = useState(false);
  const pending = mockOrders.filter(o => o.status === "PENDING").length;
  const completed = mockOrders.filter(o => o.status === "COMPLETED").length;
  const urgent = mockOrders.filter(o => o.priority === "URGENT").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Laboratory" description="Lab orders and results management">
        <Button onClick={() => setAddOpen(true)}>
          New Lab Order
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Orders" value={mockOrders.length} icon={<FlaskConical className="h-5 w-5" />} />
        <StatsCard title="Pending" value={pending} icon={<Clock className="h-5 w-5" />} />
        <StatsCard title="Completed" value={completed} icon={<CheckCircle className="h-5 w-5" />} />
        <StatsCard title="Urgent" value={urgent} icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <LabResultTable data={mockOrders} />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Lab Order</DialogTitle>
          </DialogHeader>
          <LabOrderForm
            patients={[{ id: "p1", firstName: "John", lastName: "Doe" }, { id: "p2", firstName: "Jane", lastName: "Wilson" }]}
            doctors={[{ id: "d1", user: { firstName: "Sarah", lastName: "Smith" } }]}
            onSubmit={(data) => {
              toast.success("Lab order created successfully");
              setAddOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
