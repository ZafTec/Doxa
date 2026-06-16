import "server-only";
import { ApiError } from "./errors";
import type { ApiErrorPayload } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export type ServerFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Cache lifetime in seconds. Pass `false` for indefinite, `0` for none. */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation via `revalidateTag`. */
  tags?: string[];
  /** Forward the incoming session cookie for authenticated server fetches. */
  cookie?: string;
};

export async function serverFetch<T>(
  path: string,
  { revalidate, tags, cookie, body, headers, ...init }: ServerFetchOptions = {},
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    next: { revalidate, tags },
  });

  if (!response.ok) {
    let payload: ApiErrorPayload | undefined;
    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      // ignore — body may not be JSON
    }
    throw new ApiError(
      payload?.message ?? response.statusText,
      response.status,
      payload,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const serverApi = {
  get: <T>(path: string, opts?: Omit<ServerFetchOptions, "body" | "method">) =>
    serverFetch<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: Omit<ServerFetchOptions, "body" | "method">) =>
    serverFetch<T>(path, { ...opts, method: "POST", body }),
};
