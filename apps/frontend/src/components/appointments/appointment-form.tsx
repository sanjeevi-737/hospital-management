"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { appointmentSchema, type AppointmentFormData } from "@/lib/validations";

interface AppointmentFormProps {
  patients: { id: string; firstName: string; lastName: string }[];
  doctors: { id: string; user: { firstName: string; lastName: string }; specialization: string }[];
  initialData?: Partial<AppointmentFormData>;
  onSubmit: (data: AppointmentFormData) => void;
  loading?: boolean;
}

export function AppointmentForm({ patients, doctors, initialData, onSubmit, loading }: AppointmentFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: initialData?.patientId || "",
      doctorId: initialData?.doctorId || "",
      appointmentDate: initialData?.appointmentDate || "",
      appointmentTime: initialData?.appointmentTime || "",
      type: initialData?.type || undefined,
      reason: initialData?.reason || "",
      notes: initialData?.notes || "",
    },
  });

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
                <SelectItem key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </SelectItem>
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
                <SelectItem key={d.id} value={d.id}>
                  Dr. {d.user.firstName} {d.user.lastName} - {d.specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.doctorId && <p className="text-sm text-destructive">{errors.doctorId.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="appointmentDate">Date *</Label>
          <Input id="appointmentDate" type="date" {...register("appointmentDate")} />
          {errors.appointmentDate && <p className="text-sm text-destructive">{errors.appointmentDate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="appointmentTime">Time *</Label>
          <Input id="appointmentTime" type="time" {...register("appointmentTime")} />
          {errors.appointmentTime && <p className="text-sm text-destructive">{errors.appointmentTime.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Type *</Label>
          <Select value={watch("type")} onValueChange={(val) => setValue("type", val as AppointmentFormData["type"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WALK_IN">Walk-In</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="EMERGENCY">Emergency</SelectItem>
              <SelectItem value="FOLLOW_UP">Follow-Up</SelectItem>
              <SelectItem value="TELEHEALTH">Telehealth</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea id="reason" {...register("reason")} placeholder="Reason for visit" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register("notes")} placeholder="Additional notes" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Appointment"}
        </Button>
      </div>
    </form>
  );
}
