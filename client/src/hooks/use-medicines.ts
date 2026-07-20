import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Medicine } from "@/types";
import type { PaginatedResponse, ApiResponse } from "@/types/api";
import type { MedicineFormData } from "@/lib/validations";

export function useMedicines(params?: { page?: number; limit?: number; search?: string; category?: string }) {
  return useQuery({
    queryKey: ["medicines", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Medicine>>("/medicines", { params });
      return data;
    },
  });
}

export function useMedicine(id: string) {
  return useQuery({
    queryKey: ["medicine", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Medicine>>(`/medicines/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: MedicineFormData) => {
      const { data } = await api.post<ApiResponse<Medicine>>("/medicines", formData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add medicine");
    },
  });
}

export function useUpdateMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MedicineFormData> }) => {
      const response = await api.put<ApiResponse<Medicine>>(`/medicines/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicine", variables.id] });
      toast.success("Medicine updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update medicine");
    },
  });
}

export function useDeleteMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/medicines/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete medicine");
    },
  });
}
