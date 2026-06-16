"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterControlsProps = {
  brands: FilterOption[];
  categories: FilterOption[];
};

/**
 * Top-of-catalog filter row: two multi-select dropdowns (Brand, Category).
 * State is driven entirely through URL search params so RSCs re-render
 * with the right server data on every change. Page resets to 1 when a
 * filter changes.
 */
export function FilterControls({ brands, categories }: FilterControlsProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const activeBrands = csvParam(sp.get("brand"));
  const activeCategories = csvParam(sp.get("category"));

  function commit(next: { brand?: string[]; category?: string[] }) {
    const params = new URLSearchParams(sp.toString());
    setMulti(params, "brand", next.brand ?? activeBrands);
    setMulti(params, "category", next.category ?? activeCategories);
    params.delete("page");
    const q = params.toString();
    router.push(q ? `/?${q}` : "/");
  }

  return (
    <section className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-3 md:px-12">
      <div className="flex flex-wrap items-center gap-3">
        <MultiSelectMenu
          label="Brand"
          options={brands}
          selected={activeBrands}
          onChange={(brand) => commit({ brand })}
        />
        <MultiSelectMenu
          label="Category"
          options={categories}
          selected={activeCategories}
          onChange={(category) => commit({ category })}
        />
        {(activeBrands.length > 0 || activeCategories.length > 0) && (
          <button
            type="button"
            onClick={() => commit({ brand: [], category: [] })}
            className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </div>
    </section>
  );
}

function MultiSelectMenu({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  function toggle(value: string) {
    if (selected.includes(value)) onChange(selected.filter((v) => v !== value));
    else onChange([...selected, value]);
  }

  const summary =
    selected.length === 0
      ? label
      : selected.length === 1
        ? `${label}: ${labelFor(options, selected[0])}`
        : `${label}: ${selected.length}`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={
          "flex items-center gap-2 border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors " +
          (selected.length > 0
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border text-foreground hover:bg-muted")
        }
      >
        {summary}
        <ChevronDown className="size-3" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-56 border border-border bg-background py-2 shadow-sm">
          {options.length === 0 ? (
            <span className="block px-3 py-2 text-xs text-muted-foreground">
              No options yet.
            </span>
          ) : (
            options.map((opt) => {
              const checked = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className="flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <span>{opt.label}</span>
                  {checked && <Check className="size-4 text-accent" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function labelFor(options: FilterOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function csvParam(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function setMulti(params: URLSearchParams, key: string, values: string[]): void {
  if (values.length === 0) params.delete(key);
  else params.set(key, values.join(","));
}
