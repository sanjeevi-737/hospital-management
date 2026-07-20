import { Request } from 'express';
import { UserRole } from '../enums';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  hospitalId?: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload & {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface AuditLogData {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: string;
}
