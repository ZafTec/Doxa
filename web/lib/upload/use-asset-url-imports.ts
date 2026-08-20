"use client";

import { useCallback, useRef, useState } from "react";
import { assetsClientApi } from "@/lib/api/endpoints/assets-client";
import { ApiError } from "@/lib/api/errors";
import type { Asset } from "@/lib/api/endpoints/types";

export type UrlImportStatus = "importing" | "complete" | "error";

export type UrlImportItem = {
  id: string;
  url: string;
  status: UrlImportStatus;
  error?: string;
};

/**
 * Mirrors `useAssetUploads`' item/status shape but without byte progress -
 * the fetch happens server-side, so there's nothing for the browser to
 * report progress on. Each import runs independently (no concurrency cap
 * needed): admins paste and confirm one URL at a time in practice.
 */
export function useAssetUrlImports({
  itemVariantId,
  remainingSlots,
  onImported,
}: {
  itemVariantId: string;
  remainingSlots: number;
  onImported: (asset: Asset) => void;
}) {
  const [items, setItems] = useState<UrlImportItem[]>([]);
  const acceptedCount = useRef(0);

  const patchItem = useCallback((id: string, patch: Partial<UrlImportItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const run = useCallback(
    async (item: UrlImportItem) => {
      try {
        const asset = await assetsClientApi.importFromUrl({ itemVariantId, url: item.url });
        patchItem(item.id, { status: "complete" });
        onImported(asset);
      } catch (err) {
        patchItem(item.id, { status: "error", error: ApiError.fromUnknown(err).message });
      }
    },
    [itemVariantId, onImported, patchItem],
  );

  const addUrl = useCallback(
    (url: string) => {
      if (acceptedCount.current >= remainingSlots) return;
      acceptedCount.current += 1;

      const item: UrlImportItem = { id: crypto.randomUUID(), url, status: "importing" };
      setItems((prev) => [...prev, item]);
      void run(item);
    },
    [remainingSlots, run],
  );

  const retry = useCallback(
    (item: UrlImportItem) => {
      patchItem(item.id, { status: "importing", error: undefined });
      void run(item);
    },
    [patchItem, run],
  );

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { items, addUrl, retry, dismiss };
}
