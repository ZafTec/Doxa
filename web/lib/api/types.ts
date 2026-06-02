export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiErrorPayload = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};
