import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Appointment } from "@/types";
import type { PaginatedResponse, ApiResponse } from "@/types/api";
import type { AppointmentFormData } from "@/lib/validations";

export function useAppointments(params?: { page?: number; limit?: number; date?: string; doctorId?: string; status?: string }) {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Appointment>>("/appointments", { params });
      return data;
    },
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: AppointmentFormData) => {
      const { data } = await api.post<ApiResponse<Appointment>>("/appointments", formData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment scheduled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to schedule appointment");
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch<ApiResponse<Appointment>>(`/appointments/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment status updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update status");
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment cancelled");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel appointment");
    },
  });
}
