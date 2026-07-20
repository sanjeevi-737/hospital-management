"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Doctor } from "@/types";
import type { PaginatedResponse, ApiResponse } from "@/types/api";

export function useDoctors(params?: { page?: number; limit?: number; search?: string; specialization?: string }) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Doctor>>("/doctors", { params });
      return data;
    },
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Doctor> }) => {
      const response = await api.put<ApiResponse<Doctor>>(`/doctors/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", variables.id] });
      toast.success("Doctor updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update doctor");
    },
  });
}
