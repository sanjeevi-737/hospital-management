"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Prescription } from "@/types";
import type { PaginatedResponse, ApiResponse } from "@/types/api";
import type { PrescriptionFormData } from "@/lib/validations";

export function usePrescriptions(params?: { page?: number; limit?: number; patientId?: string; doctorId?: string }) {
  return useQuery({
    queryKey: ["prescriptions", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Prescription>>("/prescriptions", { params });
      return data;
    },
  });
}

export function usePrescription(id: string) {
  return useQuery({
    queryKey: ["prescription", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Prescription>>(`/prescriptions/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: PrescriptionFormData) => {
      const { data } = await api.post<ApiResponse<Prescription>>("/prescriptions", formData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast.success("Prescription created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create prescription");
    },
  });
}

export function useDeletePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/prescriptions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast.success("Prescription deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete prescription");
    },
  });
}
