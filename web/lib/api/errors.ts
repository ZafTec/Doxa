import type { ApiErrorPayload } from "./types";

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, unknown>;

  constructor(message: string, status: number, payload?: Partial<ApiErrorPayload>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = payload?.code;
    this.details = payload?.details;
  }

  static fromUnknown(error: unknown): ApiError {
    if (error instanceof ApiError) return error;
    if (error instanceof Error) return new ApiError(error.message, 0);
    return new ApiError("Unknown error", 0);
  }
}
