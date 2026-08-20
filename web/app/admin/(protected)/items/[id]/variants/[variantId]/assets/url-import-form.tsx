"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Link2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { inputClassName } from "@/app/components/ui/input";

type PreviewState = "empty" | "checking" | "loaded" | "error";

const DEBOUNCE_MS = 400;

function looksLikeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function UrlImportForm({
  disabled,
  onConfirm,
}: {
  disabled: boolean;
  onConfirm: (url: string) => void;
}) {
  const [value, setValue] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, setState] = useState<PreviewState>("empty");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup only - the actual debounce is scheduled imperatively in
  // handleChange (an event handler), not synced reactively via an effect.
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleChange = (next: string) => {
    setValue(next);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!looksLikeUrl(next)) {
      setPreviewUrl(null);
      setState("empty");
      return;
    }

    setState("checking");
    debounceTimer.current = setTimeout(() => setPreviewUrl(next), DEBOUNCE_MS);
  };

  const handleConfirm = () => {
    if (state !== "loaded" || !previewUrl) return;
    onConfirm(previewUrl);
    setValue("");
    setPreviewUrl(null);
    setState("empty");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Link2 className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          type="url"
          inputMode="url"
          placeholder="Paste an image URL…"
          value={value}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleConfirm();
            }
          }}
          className={inputClassName}
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={disabled || state !== "loaded"}
          onClick={handleConfirm}
          className="shrink-0"
        >
          Add
        </Button>
      </div>

      {previewUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-3 border border-border p-3"
        >
          <div className="relative size-16 shrink-0 overflow-hidden border border-border bg-muted">
            {/* Arbitrary external host - next/image can't optimize an
                unknown domain, and this is a throwaway confirmation preview. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt=""
              className="size-full object-cover"
              onLoad={() => setState("loaded")}
              onError={() => setState("error")}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {state === "checking" && "Loading preview…"}
            {state === "loaded" && "Looks good - confirm to save it to storage."}
            {state === "error" && "Couldn't load an image from that URL."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
