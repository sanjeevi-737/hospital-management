export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: import("./index").User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  totalDoctors: number;
  revenue: number;
  occupancyRate: number;
  pendingLabOrders: number;
  lowStockMedicines: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}
