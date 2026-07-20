import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { labOrderSchema, type LabOrderFormData } from "@/lib/validations";

interface LabOrderFormProps {
  patients: { id: string; firstName: string; lastName: string }[];
  doctors: { id: string; user: { firstName: string; lastName: string } }[];
  onSubmit: (data: LabOrderFormData) => void;
  loading?: boolean;
}

export function LabOrderForm({ patients, doctors, onSubmit, loading }: LabOrderFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LabOrderFormData>({
    resolver: zodResolver(labOrderSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      testType: "",
      testName: "",
      priority: undefined,
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <Label>Doctor *</Label>
          <Select value={watch("doctorId")} onValueChange={(val) => setValue("doctorId", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((d) => (
                <SelectItem key={d.id} value={d.id}>Dr. {d.user.firstName} {d.user.lastName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.doctorId && <p className="text-sm text-destructive">{errors.doctorId.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="testType">Test Type *</Label>
          <Input id="testType" {...register("testType")} placeholder="Blood Test" />
          {errors.testType && <p className="text-sm text-destructive">{errors.testType.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="testName">Test Name *</Label>
          <Input id="testName" {...register("testName")} placeholder="Complete Blood Count" />
          {errors.testName && <p className="text-sm text-destructive">{errors.testName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Priority *</Label>
          <Select value={watch("priority")} onValueChange={(val) => setValue("priority", val as LabOrderFormData["priority"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ROUTINE">Routine</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
              <SelectItem value="STAT">STAT</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register("notes")} placeholder="Additional instructions" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Lab Order"}
        </Button>
      </div>
    </form>
  );
}
