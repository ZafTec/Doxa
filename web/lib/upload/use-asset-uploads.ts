"use client";

import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { assetsClientApi, uploadAssetFile } from "@/lib/api/endpoints/assets-client";
import { ApiError } from "@/lib/api/errors";
import {
  ALLOWED_ASSET_IMAGE_TYPES,
  MAX_ASSET_IMAGE_SIZE,
  type Asset,
  type AssetImageType,
} from "@/lib/api/endpoints/types";

export type UploadStatus =
  | "idle"
  | "requesting-url"
  | "uploading"
  | "finalizing"
  | "complete"
  | "error"
  | "cancelled";

export type UploadItem = {
  id: string;
  file: File;
  status: UploadStatus;
  loaded: number;
  total: number;
  percent: number;
  error?: string;
};

const MAX_CONCURRENT_UPLOADS = 2;

function isAllowedImageType(type: string): type is AssetImageType {
  return (ALLOWED_ASSET_IMAGE_TYPES as readonly string[]).includes(type);
}

function validateFile(file: File): string | null {
  if (!isAllowedImageType(file.type)) {
    return "Unsupported file type - use JPEG, PNG, WebP, or AVIF";
  }
  if (file.size > MAX_ASSET_IMAGE_SIZE) {
    return `File is larger than ${Math.round(MAX_ASSET_IMAGE_SIZE / (1024 * 1024))}MB`;
  }
  return null;
}

function axiosCancelled(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "ERR_CANCELED"
  );
}

/**
 * Orchestrates the presign -> PUT -> complete lifecycle for one or more
 * files, with bounded concurrency (2 at a time) and byte-weighted overall
 * progress. There's no imperative "process the queue" call: a `useEffect`
 * re-scans `items` for idle work every time it changes (new files added, a
 * slot freed up, a retry) and dispatches through `runUpload`, a
 * `useEffectEvent` so it always sees the latest `itemVariantId`/`onUploaded`
 * without a manually-maintained "latest callback" ref. Effect Events can
 * only be called from Effects, which is why dispatch lives in the effect
 * below rather than in `addFiles`/`retry` directly.
 */
export function useAssetUploads({
  itemVariantId,
  remainingSlots,
  onUploaded,
}: {
  itemVariantId: string;
  /** How many more assets this variant can hold, from the server-known count. */
  remainingSlots: number;
  onUploaded: (asset: Asset) => void;
}) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const controllers = useRef(new Map<string, AbortController>());
  const inFlight = useRef(new Set<string>());
  const acceptedCount = useRef(0);

  const patchItem = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const runUpload = useEffectEvent(async (item: UploadItem) => {
    const controller = new AbortController();
    controllers.current.set(item.id, controller);

    try {
      patchItem(item.id, { status: "requesting-url" });
      const ticket = await assetsClientApi.presign({
        itemVariantId,
        fileName: item.file.name,
        contentType: item.file.type as AssetImageType,
        size: item.file.size,
      });

      patchItem(item.id, { status: "uploading" });
      await uploadAssetFile(ticket.uploadUrl, item.file, ticket.headers, {
        signal: controller.signal,
        onProgress: ({ loaded, total, percent }) => {
          patchItem(item.id, { loaded, total, percent });
        },
      });

      patchItem(item.id, { status: "finalizing" });
      const asset = await assetsClientApi.complete({
        itemVariantId,
        key: ticket.key,
        originalName: item.file.name,
        expectedContentType: item.file.type as AssetImageType,
        expectedSize: item.file.size,
      });

      patchItem(item.id, { status: "complete", percent: 100 });
      onUploaded(asset);
    } catch (err) {
      if (axiosCancelled(err)) {
        patchItem(item.id, { status: "cancelled" });
      } else {
        patchItem(item.id, { status: "error", error: ApiError.fromUnknown(err).message });
      }
    } finally {
      controllers.current.delete(item.id);
      inFlight.current.delete(item.id);
    }
  });

  useEffect(() => {
    const pending = items.filter((item) => item.status === "idle" && !inFlight.current.has(item.id));
    const capacity = MAX_CONCURRENT_UPLOADS - inFlight.current.size;

    pending.slice(0, Math.max(0, capacity)).forEach((item) => {
      inFlight.current.add(item.id);
      void runUpload(item);
    });
  }, [items]);

  const addFiles = useCallback(
    (files: File[]) => {
      const slotsLeft = remainingSlots - acceptedCount.current;
      const accepted: UploadItem[] = files.slice(0, Math.max(0, slotsLeft)).map((file) => {
        const error = validateFile(file);
        return {
          id: crypto.randomUUID(),
          file,
          status: error ? "error" : "idle",
          loaded: 0,
          total: file.size,
          percent: 0,
          error: error ?? undefined,
        };
      });

      acceptedCount.current += accepted.length;
      setItems((prev) => [...prev, ...accepted]);
    },
    [remainingSlots],
  );

  const cancel = useCallback((id: string) => {
    controllers.current.get(id)?.abort();
  }, []);

  const retry = useCallback(
    (id: string) => {
      patchItem(id, { status: "idle", error: undefined, loaded: 0, percent: 0 });
    },
    [patchItem],
  );

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const overall = useMemo(() => {
    const active = items.filter(
      (item) => item.status === "uploading" || item.status === "finalizing",
    );
    const totalBytes = active.reduce((sum, item) => sum + item.total, 0);
    const uploadedBytes = active.reduce((sum, item) => sum + item.loaded, 0);
    return {
      percent: totalBytes === 0 ? 0 : Math.round((uploadedBytes / totalBytes) * 100),
      activeCount: active.length,
    };
  }, [items]);

  return { items, addFiles, cancel, retry, dismiss, overall };
}
