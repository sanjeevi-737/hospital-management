"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { paymentSchema, type PaymentFormData } from "@/lib/validations";
import { PAYMENT_METHODS } from "@/lib/constants";

interface PaymentFormProps {
  invoiceTotal: number;
  amountPaid: number;
  onSubmit: (data: PaymentFormData) => void;
  loading?: boolean;
}

export function PaymentForm({ invoiceTotal, amountPaid, onSubmit, loading }: PaymentFormProps) {
  const remaining = invoiceTotal - amountPaid;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: remaining,
      method: undefined,
      reference: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-lg bg-muted p-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Invoice Total</span>
          <span className="font-medium">${invoiceTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Amount Paid</span>
          <span className="font-medium">${amountPaid.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t pt-1">
          <span className="font-semibold">Remaining</span>
          <span className="font-semibold">${remaining.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($) *</Label>
        <Input id="amount" type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
        {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Payment Method *</Label>
        <Select value={watch("method")} onValueChange={(val) => setValue("method", val as PaymentFormData["method"])}>
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_METHODS.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.method && <p className="text-sm text-destructive">{errors.method.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Reference Number</Label>
        <Input id="reference" {...register("reference")} placeholder="Transaction ID, check number, etc." />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Process Payment"}
        </Button>
      </div>
    </form>
  );
}
