import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invoiceSchema, type InvoiceFormData } from "@/lib/validations";
import { Plus, Trash2 } from "lucide-react";

interface InvoiceFormProps {
  patients: { id: string; firstName: string; lastName: string }[];
  onSubmit: (data: InvoiceFormData) => void;
  loading?: boolean;
}

export function InvoiceForm({ patients, onSubmit, loading }: InvoiceFormProps) {
  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      patientId: "",
      items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
      tax: 0,
      discount: 0,
      notes: "",
      dueDate: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const items = watch("items");
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = watch("tax") || 0;
  const discount = watch("discount") || 0;
  const total = subtotal + tax - discount;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Patient *</Label>
          <Select value={watch("patientId")} onValueChange={(val) => setValue("patientId", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.patientId && <p className="text-sm text-destructive">{errors.patientId.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Line Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unitPrice: 0, total: 0 })}>
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-5 space-y-2">
              {index === 0 && <Label>Description *</Label>}
              <Input {...register(`items.${index}.description`)} placeholder="Service description" />
            </div>
            <div className="col-span-2 space-y-2">
              {index === 0 && <Label>Qty *</Label>}
              <Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
            </div>
            <div className="col-span-2 space-y-2">
              {index === 0 && <Label>Price *</Label>}
              <Input type="number" step="0.01" {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} />
            </div>
            <div className="col-span-2 space-y-2">
              {index === 0 && <Label>Total</Label>}
              <Input disabled value={`$${(items[index]?.quantity || 0) * (items[index]?.unitPrice || 0)}`} />
            </div>
            <div className="col-span-1">
              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md ml-auto">
        <div className="space-y-2">
          <Label htmlFor="tax">Tax ($)</Label>
          <Input id="tax" type="number" step="0.01" {...register("tax", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Discount ($)</Label>
          <Input id="discount" type="number" step="0.01" {...register("discount", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Total</Label>
          <div className="h-10 flex items-center text-lg font-bold">${total.toFixed(2)}</div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register("notes")} placeholder="Invoice notes" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
