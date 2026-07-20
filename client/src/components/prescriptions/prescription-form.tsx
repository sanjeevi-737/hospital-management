import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prescriptionSchema, type PrescriptionFormData } from "@/lib/validations";
import { Plus, Trash2 } from "lucide-react";

interface PrescriptionFormProps {
  patients: { id: string; firstName: string; lastName: string }[];
  doctors: { id: string; user: { firstName: string; lastName: string } }[];
  onSubmit: (data: PrescriptionFormData) => void;
  loading?: boolean;
}

export function PrescriptionForm({ patients, doctors, onSubmit, loading }: PrescriptionFormProps) {
  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      medications: [{ name: "", dosage: "", frequency: "", duration: "", notes: "" }],
      instructions: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "medications" });

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
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Medications</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", dosage: "", frequency: "", duration: "", notes: "" })}>
            <Plus className="h-4 w-4 mr-1" /> Add Medication
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Medication {index + 1}</CardTitle>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input {...register(`medications.${index}.name`)} placeholder="Amoxicillin" />
                  {errors.medications?.[index]?.name && <p className="text-sm text-destructive">{errors.medications[index]?.name?.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Dosage *</Label>
                  <Input {...register(`medications.${index}.dosage`)} placeholder="500mg" />
                </div>
                <div className="space-y-2">
                  <Label>Frequency *</Label>
                  <Input {...register(`medications.${index}.frequency`)} placeholder="3 times daily" />
                </div>
                <div className="space-y-2">
                  <Label>Duration *</Label>
                  <Input {...register(`medications.${index}.duration`)} placeholder="7 days" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Notes</Label>
                  <Input {...register(`medications.${index}.notes`)} placeholder="Take with food" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea id="instructions" {...register("instructions")} placeholder="Additional instructions for the patient" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Prescription"}
        </Button>
      </div>
    </form>
  );
}
