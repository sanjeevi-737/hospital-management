import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Invoice, Payment } from "@/types";
import type { PaginatedResponse, ApiResponse } from "@/types/api";
import type { InvoiceFormData, PaymentFormData } from "@/lib/validations";

export function useInvoices(params?: { page?: number; limit?: number; patientId?: string; status?: string }) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Invoice>>("/invoices", { params });
      return data;
    },
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Invoice>>(`/invoices/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: InvoiceFormData) => {
      const { data } = await api.post<ApiResponse<Invoice>>("/invoices", formData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create invoice");
    },
  });
}

export function useProcessPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ invoiceId, data }: { invoiceId: string; data: PaymentFormData }) => {
      const response = await api.post<ApiResponse<Payment>>(`/invoices/${invoiceId}/payments`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Payment processed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to process payment");
    },
  });
}
