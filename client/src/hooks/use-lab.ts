import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import type { LabOrder } from "@/types";
import type { PaginatedResponse, ApiResponse } from "@/types/api";
import type { LabOrderFormData, LabResultFormData } from "@/lib/validations";

export function useLabOrders(params?: { page?: number; limit?: number; patientId?: string; status?: string }) {
  return useQuery({
    queryKey: ["labOrders", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<LabOrder>>("/lab-orders", { params });
      return data;
    },
  });
}

export function useLabOrder(id: string) {
  return useQuery({
    queryKey: ["labOrder", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<LabOrder>>(`/lab-orders/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateLabOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: LabOrderFormData) => {
      const { data } = await api.post<ApiResponse<LabOrder>>("/lab-orders", formData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labOrders"] });
      toast.success("Lab order created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create lab order");
    },
  });
}

export function useUpdateLabResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LabResultFormData }) => {
      const response = await api.patch<ApiResponse<LabOrder>>(`/lab-orders/${id}/result`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["labOrders"] });
      queryClient.invalidateQueries({ queryKey: ["labOrder", variables.id] });
      toast.success("Lab result updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update lab result");
    },
  });
}
