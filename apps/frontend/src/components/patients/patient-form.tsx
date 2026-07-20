"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patientSchema, type PatientFormData } from "@/lib/validations";
import { GENDER_OPTIONS, BLOOD_GROUP_OPTIONS } from "@/lib/constants";

interface PatientFormProps {
  initialData?: Partial<PatientFormData>;
  onSubmit: (data: PatientFormData) => void;
  loading?: boolean;
}

export function PatientForm({ initialData, onSubmit, loading }: PatientFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      dateOfBirth: initialData?.dateOfBirth || "",
      gender: initialData?.gender || undefined,
      bloodGroup: initialData?.bloodGroup || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipCode: initialData?.zipCode || "",
      emergencyContact: initialData?.emergencyContact || "",
      emergencyPhone: initialData?.emergencyPhone || "",
      insuranceProvider: initialData?.insuranceProvider || "",
      insuranceId: initialData?.insuranceId || "",
      allergies: initialData?.allergies || "",
      medicalHistory: initialData?.medicalHistory || "",
    },
  });

  const gender = watch("gender");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input id="firstName" {...register("firstName")} placeholder="John" />
          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input id="lastName" {...register("lastName")} placeholder="Doe" />
          {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" {...register("phone")} placeholder="(555) 010-1001" />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
          {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Gender *</Label>
          <Select value={gender} onValueChange={(val) => setValue("gender", val as "MALE" | "FEMALE" | "OTHER")}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Blood Group</Label>
          <Select value={watch("bloodGroup")} onValueChange={(val) => setValue("bloodGroup", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_GROUP_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" {...register("address")} placeholder="123 Main St" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} placeholder="New York" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register("state")} placeholder="NY" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input id="zipCode" {...register("zipCode")} placeholder="10001" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input id="emergencyContact" {...register("emergencyContact")} placeholder="Jane Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyPhone">Emergency Phone</Label>
          <Input id="emergencyPhone" {...register("emergencyPhone")} placeholder="(555) 010-1002" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="insuranceProvider">Insurance Provider</Label>
          <Input id="insuranceProvider" {...register("insuranceProvider")} placeholder="Blue Cross" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insuranceId">Insurance ID</Label>
          <Input id="insuranceId" {...register("insuranceId")} placeholder="INS-12345" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea id="allergies" {...register("allergies")} placeholder="Penicillin, Peanuts..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medicalHistory">Medical History</Label>
        <Textarea id="medicalHistory" {...register("medicalHistory")} placeholder="Previous conditions..." />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Patient" : "Create Patient"}
        </Button>
      </div>
    </form>
  );
}
