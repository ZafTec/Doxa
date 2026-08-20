import axios from "axios";
import { api } from "../client";
import type {
  Asset,
  CompleteAssetUploadPayload,
  ImportAssetFromUrlPayload,
  PresignAssetUploadPayload,
  PresignAssetUploadTicket,
} from "./types";

export const assetsClientApi = {
  presign: (payload: PresignAssetUploadPayload) =>
    api.post<PresignAssetUploadTicket>("/asset/uploads/presign", payload),

  complete: (payload: CompleteAssetUploadPayload) =>
    api.post<Asset>("/asset/uploads/complete", payload),

  /** Server fetches the URL, validates it, and writes the bytes to MinIO. */
  importFromUrl: (payload: ImportAssetFromUrlPayload) =>
    api.post<Asset>("/asset/uploads/from-url", payload),

  remove: (assetId: string) => api.delete<{ message: string }>(`/asset/${assetId}`),
};

export type UploadProgress = {
  loaded: number;
  total: number;
  percent: number;
};

/**
 * PUTs raw file bytes directly to MinIO via a presigned URL. Deliberately
 * bypasses `apiClient`: this request targets MinIO, not the Nest API, and
 * must not carry `withCredentials` or the Nest JSON content type.
 */
export async function uploadAssetFile(
  uploadUrl: string,
  file: File,
  headers: Record<string, string>,
  options: {
    signal?: AbortSignal;
    onProgress: (progress: UploadProgress) => void;
  },
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers,
    signal: options.signal,
    withCredentials: false,
    onUploadProgress: ({ loaded }) => {
      const total = file.size;
      const percent = total === 0 ? 0 : Math.min(100, Math.round((loaded / total) * 100));

      options.onProgress({ loaded, total, percent });
    },
  });
}
