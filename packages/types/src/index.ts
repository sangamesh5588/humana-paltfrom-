export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    path: string;
    [key: string]: unknown;
  };
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

export const API_VERSION = '1.0.0';
