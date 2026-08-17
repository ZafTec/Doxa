export const inputClassName =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent";

export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
      {children}
      {error && (
        <span className="block text-xs font-medium text-foreground underline decoration-2 underline-offset-2">
          {error}
        </span>
      )}
    </label>
  );
}

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full bg-accent text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}
