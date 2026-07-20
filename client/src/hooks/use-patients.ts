import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Patient } from "@/types";
import type { PaginatedResponse, ApiResponse } from "@/types/api";
import type { PatientFormData } from "@/lib/validations";

export function usePatients(params?: { page?: number; limit?: number; search?: string; gender?: string }) {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Patient>>("/patients", { params });
      return data;
    },
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Patient>>(`/patients/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: PatientFormData) => {
      const { data } = await api.post<ApiResponse<Patient>>("/patients", formData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create patient");
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PatientFormData> }) => {
      const response = await api.put<ApiResponse<Patient>>(`/patients/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", variables.id] });
      toast.success("Patient updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update patient");
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/patients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete patient");
    },
  });
}
