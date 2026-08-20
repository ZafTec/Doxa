"use client";

import { useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { UploadCloud, X, RotateCcw, Trash2 } from "lucide-react";
import { useAssetUploads, type UploadItem } from "@/lib/upload/use-asset-uploads";
import { useAssetUrlImports, type UrlImportItem } from "@/lib/upload/use-asset-url-imports";
import { assetsClientApi } from "@/lib/api/endpoints/assets-client";
import { ApiError } from "@/lib/api/errors";
import { ALLOWED_ASSET_IMAGE_TYPES, MAX_ASSETS_PER_VARIANT, type Asset } from "@/lib/api/endpoints/types";
import { Button } from "@/app/components/ui/button";
import { IconButton } from "@/app/components/ui/icon-button";
import { eyebrowClassName } from "@/app/components/ui/eyebrow";
import { Card } from "@/app/components/ui/card";
import { UrlImportForm } from "./url-import-form";

const ACCEPT = ALLOWED_ASSET_IMAGE_TYPES.join(",");

// Entering rows settle in; leaving rows should get out of the way fast -
// asymmetric timing so removal never feels like it's blocking the user.
const rowVariants = {
  initial: { opacity: 0, y: -6, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
  },
} as const;

const thumbnailVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
  },
} as const;

function uploadStatusLabel(item: UploadItem): string | null {
  switch (item.status) {
    case "requesting-url":
      return "Preparing…";
    case "finalizing":
      return "Finalizing…";
    case "cancelled":
      return "Cancelled";
    case "error":
      return item.error ?? "Upload failed";
    default:
      return null;
  }
}

export function AssetManager({
  itemVariantId,
  initialAssets,
}: {
  itemVariantId: string;
  initialAssets: Asset[];
}) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const remainingSlots = Math.max(0, MAX_ASSETS_PER_VARIANT - assets.length);

  const { items, addFiles, cancel, retry, dismiss, overall } = useAssetUploads({
    itemVariantId,
    remainingSlots,
    onUploaded: (asset) => setAssets((prev) => [...prev, asset]),
  });

  const urlImports = useAssetUrlImports({
    itemVariantId,
    remainingSlots,
    onImported: (asset) => setAssets((prev) => [...prev, asset]),
  });

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    addFiles(Array.from(fileList));
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async (assetId: string) => {
    setDeleteError(null);
    const previous = assets;
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    try {
      await assetsClientApi.remove(assetId);
    } catch (err) {
      setAssets(previous);
      setDeleteError(ApiError.fromUnknown(err).message);
    }
  };

  const isFileDrag = (e: DragEvent) => Array.from(e.dataTransfer.types).includes("Files");

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragCounter.current += 1;
    setIsDraggingOver(true);
  };
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
  };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!isFileDrag(e)) return;
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setIsDraggingOver(false);
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragCounter.current = 0;
    setIsDraggingOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const activeUploads = items.filter((item) => item.status !== "complete");
  const activeUrlImports = urlImports.items.filter((item) => item.status !== "complete");

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className={eyebrowClassName}>
            Images ({assets.length}/{MAX_ASSETS_PER_VARIANT})
          </span>
          <label>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPT}
              className="sr-only"
              disabled={remainingSlots === 0}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <Button
              type="button"
              size="xs"
              variant="secondary"
              disabled={remainingSlots === 0}
              onClick={() => inputRef.current?.click()}
            >
              Add images
            </Button>
          </label>
        </div>

        {deleteError && (
          <p className="mb-3 border border-border bg-muted px-4 py-3 text-sm">{deleteError}</p>
        )}

        <div
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className="relative"
        >
          <AnimatePresence>
            {isDraggingOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2 border-2 border-dashed border-accent bg-background/90"
              >
                <UploadCloud className="size-5 text-accent" aria-hidden />
                <span className="text-sm font-medium">Drop to upload</span>
              </motion.div>
            )}
          </AnimatePresence>

          {assets.length === 0 && activeUploads.length === 0 ? (
            <div className="border border-dashed border-border py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No images yet - drag files here or use &ldquo;Add images&rdquo;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {assets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    layout
                    variants={thumbnailVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="group relative aspect-square border border-border"
                  >
                    <Image
                      src={asset.url}
                      alt={asset.originalName ?? ""}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover"
                      unoptimized={!isOptimizableHost(asset.url)}
                    />
                    <IconButton
                      className="absolute right-1 top-1 bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label={`Delete ${asset.originalName ?? "image"}`}
                      onClick={() => void handleDelete(asset.id)}
                    >
                      <Trash2 className="size-4" />
                    </IconButton>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-6">
        <span className={eyebrowClassName}>Or add from a URL</span>
        <UrlImportForm disabled={remainingSlots === 0} onConfirm={urlImports.addUrl} />
      </div>

      {(activeUploads.length > 0 || activeUrlImports.length > 0) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={eyebrowClassName}>In progress</span>
            {overall.activeCount > 1 && (
              <span className="text-xs tabular-nums text-muted-foreground">
                {overall.percent}% overall
              </span>
            )}
          </div>

          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {activeUploads.map((item) => (
                <UploadRow
                  key={item.id}
                  item={item}
                  onCancel={() => cancel(item.id)}
                  onRetry={() => retry(item.id)}
                  onDismiss={() => dismiss(item.id)}
                />
              ))}
              {activeUrlImports.map((item) => (
                <UrlImportRow
                  key={item.id}
                  item={item}
                  onRetry={() => urlImports.retry(item)}
                  onDismiss={() => urlImports.dismiss(item.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

function isOptimizableHost(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "storage.zaftech.co" || hostname === "localhost";
  } catch {
    return false;
  }
}

function ProgressBar({ percent, indeterminate }: { percent: number; indeterminate?: boolean }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : percent}
      className="relative h-1 w-full overflow-hidden bg-muted"
    >
      {indeterminate ? (
        <motion.div
          className="absolute inset-y-0 left-0 w-1/3 bg-foreground"
          animate={{ x: ["-100%", "400%"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left bg-foreground"
          initial={false}
          animate={{ scaleX: percent / 100 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      )}
    </div>
  );
}

function RowActions({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex gap-3">{children}</div>;
}

function RowActionButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={eyebrowClassName + " flex items-center gap-1 hover:text-foreground"}
    >
      {icon}
      {label}
    </button>
  );
}

function UploadRow({
  item,
  onCancel,
  onRetry,
  onDismiss,
}: {
  item: UploadItem;
  onCancel: () => void;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  const canCancel = item.status === "requesting-url" || item.status === "uploading";
  const canRetry = item.status === "error" || item.status === "cancelled";
  const label = uploadStatusLabel(item);

  return (
    <motion.div layout variants={rowVariants} initial="initial" animate="animate" exit="exit">
      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="truncate text-sm">{item.file.name}</span>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {item.percent}%
          </span>
        </div>

        <ProgressBar
          percent={item.status === "finalizing" ? 100 : item.percent}
          indeterminate={item.status === "requesting-url" || item.status === "finalizing"}
        />

        <div className="mt-2 flex items-center justify-between">
          <p aria-live="polite" className="text-xs text-muted-foreground">
            {label}
          </p>
          <RowActions>
            {canCancel && (
              <RowActionButton onClick={onCancel} icon={<X className="size-3" />} label="Cancel" />
            )}
            {canRetry && (
              <>
                <RowActionButton
                  onClick={onRetry}
                  icon={<RotateCcw className="size-3" />}
                  label="Retry"
                />
                <RowActionButton onClick={onDismiss} label="Dismiss" />
              </>
            )}
          </RowActions>
        </div>
      </Card>
    </motion.div>
  );
}

function UrlImportRow({
  item,
  onRetry,
  onDismiss,
}: {
  item: UrlImportItem;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div layout variants={rowVariants} initial="initial" animate="animate" exit="exit">
      <Card className="p-4">
        <div className="mb-2 truncate text-sm">{item.url}</div>

        <ProgressBar percent={0} indeterminate={item.status === "importing"} />

        <div className="mt-2 flex items-center justify-between">
          <p aria-live="polite" className="text-xs text-muted-foreground">
            {item.status === "importing" && "Fetching and storing…"}
            {item.status === "error" && (item.error ?? "Import failed")}
          </p>
          {item.status === "error" && (
            <RowActions>
              <RowActionButton onClick={onRetry} icon={<RotateCcw className="size-3" />} label="Retry" />
              <RowActionButton onClick={onDismiss} label="Dismiss" />
            </RowActions>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
