export class BaseResponseDto<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  constructor(partial: Partial<BaseResponseDto<T>>) {
    Object.assign(this, partial);
  }
}

export class ErrorResponseDto {
  success: boolean = false;
  error: {
    statusCode: number;
    message: string | string[];
    error: string;
    timestamp?: string;
    path?: string;
  };

  constructor(statusCode: number, message: string | string[], error: string) {
    this.error = {
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
    };
  }
}
