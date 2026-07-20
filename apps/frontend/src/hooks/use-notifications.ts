"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { useNotificationStore } from "@/stores/notification-store";
import type { Notification } from "@/types";
import type { PaginatedResponse, ApiResponse } from "@/types/api";
import { useEffect } from "react";

export function useNotifications(params?: { page?: number; limit?: number }) {
  const { setNotifications } = useNotificationStore();
  const query = useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Notification>>("/notifications", { params });
      return data;
    },
  });

  useEffect(() => {
    if (query.data?.data) {
      setNotifications(query.data.data);
    }
  }, [query.data, setNotifications]);

  return query;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { markAsRead } = useNotificationStore();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`);
      markAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const { markAllAsRead } = useNotificationStore();

  return useMutation({
    mutationFn: async () => {
      await api.patch("/notifications/read-all");
      markAllAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });
}
