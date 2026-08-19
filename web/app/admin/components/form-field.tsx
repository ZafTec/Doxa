import { inputClassName } from "@/app/components/ui/input";
import { eyebrowClassName } from "@/app/components/ui/eyebrow";
import { Button } from "@/app/components/ui/button";

export { inputClassName };

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
      <span className={"block " + eyebrowClassName}>{label}</span>
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
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Saving…" : children}
    </Button>
  );
}
