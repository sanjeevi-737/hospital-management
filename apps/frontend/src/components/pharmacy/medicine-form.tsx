"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { medicineSchema, type MedicineFormData } from "@/lib/validations";
import { MEDICINE_CATEGORIES } from "@/lib/constants";

interface MedicineFormProps {
  initialData?: Partial<MedicineFormData>;
  onSubmit: (data: MedicineFormData) => void;
  loading?: boolean;
}

export function MedicineForm({ initialData, onSubmit, loading }: MedicineFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<MedicineFormData>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: initialData?.name || "",
      genericName: initialData?.genericName || "",
      category: initialData?.category || "",
      manufacturer: initialData?.manufacturer || "",
      dosageForm: initialData?.dosageForm || "",
      strength: initialData?.strength || "",
      unitPrice: initialData?.unitPrice || 0,
      quantity: initialData?.quantity || 0,
      minStockLevel: initialData?.minStockLevel || 10,
      expiryDate: initialData?.expiryDate || "",
      batchNumber: initialData?.batchNumber || "",
      description: initialData?.description || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register("name")} placeholder="Amoxicillin" />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="genericName">Generic Name</Label>
          <Input id="genericName" {...register("genericName")} placeholder="Amoxicillin Trihydrate" />
        </div>
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={watch("category")} onValueChange={(val) => setValue("category", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {MEDICINE_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input id="manufacturer" {...register("manufacturer")} placeholder="PharmaCorp" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dosageForm">Dosage Form *</Label>
          <Input id="dosageForm" {...register("dosageForm")} placeholder="Tablet" />
          {errors.dosageForm && <p className="text-sm text-destructive">{errors.dosageForm.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="strength">Strength *</Label>
          <Input id="strength" {...register("strength")} placeholder="500mg" />
          {errors.strength && <p className="text-sm text-destructive">{errors.strength.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="unitPrice">Unit Price ($) *</Label>
          <Input id="unitPrice" type="number" step="0.01" {...register("unitPrice", { valueAsNumber: true })} />
          {errors.unitPrice && <p className="text-sm text-destructive">{errors.unitPrice.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input id="quantity" type="number" {...register("quantity", { valueAsNumber: true })} />
          {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="minStockLevel">Min Stock Level *</Label>
          <Input id="minStockLevel" type="number" {...register("minStockLevel", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date *</Label>
          <Input id="expiryDate" type="date" {...register("expiryDate")} />
          {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="batchNumber">Batch Number</Label>
          <Input id="batchNumber" {...register("batchNumber")} placeholder="BAT-001" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} placeholder="Additional details about the medicine" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Medicine" : "Add Medicine"}
        </Button>
      </div>
    </form>
  );
}
