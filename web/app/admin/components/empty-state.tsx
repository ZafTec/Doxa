import { DoxaAvatar } from "@/app/components/ui/doxa-avatar";

/**
 * First-use orientation for an empty admin list. Calm mood, not lost/broken -
 * nothing is wrong here, there's just nothing yet. Points at the page's own
 * "New X" action rather than duplicating it.
 */
export function AdminEmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-3 border border-border py-16 text-center">
      <DoxaAvatar mood="calm" className="size-10 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
