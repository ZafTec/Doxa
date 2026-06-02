"use client";

import { useUiStore } from "@/lib/store";

export default function Home() {
  const theme = useUiStore((s) => s.theme);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      <h1 className="text-5xl font-bold tracking-tight">Doxa</h1>
      <p className="max-w-md text-center text-sm opacity-60">
        Placeholder storefront. Use the header to toggle the sidebar and switch
        themes — both are driven by <code className="font-mono">useUiStore</code>.
      </p>
      <dl className="rounded-md border border-black/10 px-4 py-3 font-mono text-xs dark:border-white/15">
        <div className="flex gap-3">
          <dt className="opacity-60">theme</dt>
          <dd>{theme}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="opacity-60">sidebarOpen</dt>
          <dd>{String(sidebarOpen)}</dd>
        </div>
      </dl>
    </div>
  );
}
