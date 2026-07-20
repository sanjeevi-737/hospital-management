import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import api from "@/lib/api";
import { ROUTES } from "@/lib/constants";
import type { LoginFormData } from "@/lib/validations";

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await api.post("/auth/login", data);
      const { user, token, refreshToken } = response.data.data;
      login(user, token, refreshToken);
      toast.success("Welcome back!");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    toast.success("Logged out successfully");
  };

  return { user, isAuthenticated, login: handleLogin, logout: handleLogout };
}
