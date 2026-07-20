import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { MedicineTable } from "@/components/pharmacy/medicine-table";
import { StockAlert } from "@/components/pharmacy/stock-alert";
import { MedicineForm } from "@/components/pharmacy/medicine-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Medicine } from "@/types";

const mockMedicines: Medicine[] = [
  { id: "1", name: "Amoxicillin", genericName: "Amoxicillin Trihydrate", category: "Antibiotics", manufacturer: "PharmaCorp", dosageForm: "Capsule", strength: "500mg", unitPrice: 12.99, quantity: 200, minStockLevel: 50, expiryDate: "2026-06-30", batchNumber: "BAT-001", createdAt: "", updatedAt: "" },
  { id: "2", name: "Lisinopril", genericName: "Lisinopril Dihydrate", category: "Cardiovascular", manufacturer: "HeartMed", dosageForm: "Tablet", strength: "10mg", unitPrice: 8.50, quantity: 35, minStockLevel: 50, expiryDate: "2026-03-15", batchNumber: "BAT-002", createdAt: "", updatedAt: "" },
  { id: "3", name: "Ibuprofen", genericName: "Ibuprofen", category: "Analgesics", manufacturer: "PainRelief", dosageForm: "Tablet", strength: "400mg", unitPrice: 5.99, quantity: 500, minStockLevel: 100, expiryDate: "2026-12-31", batchNumber: "BAT-003", createdAt: "", updatedAt: "" },
  { id: "4", name: "Cetirizine", genericName: "Cetirizine HCl", category: "Antihistamines", manufacturer: "AllerCare", dosageForm: "Tablet", strength: "10mg", unitPrice: 7.25, quantity: 15, minStockLevel: 30, expiryDate: "2025-09-30", batchNumber: "BAT-004", createdAt: "", updatedAt: "" },
  { id: "5", name: "Metformin", genericName: "Metformin HCl", category: "Other", manufacturer: "DiabeCare", dosageForm: "Tablet", strength: "500mg", unitPrice: 9.99, quantity: 80, minStockLevel: 40, expiryDate: "2026-08-15", batchNumber: "BAT-005", createdAt: "", updatedAt: "" },
];

export default function PharmacyPage() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Pharmacy" description="Medicine inventory management">
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </Button>
      </PageHeader>

      <StockAlert medicines={mockMedicines} />
      <MedicineTable data={mockMedicines} />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
          </DialogHeader>
          <MedicineForm
            onSubmit={(data) => {
              toast.success("Medicine added successfully");
              setAddOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
