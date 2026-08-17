type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : undefined;

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm border border-border p-8">
        <span className="mb-1 block text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Doxa
        </span>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Admin sign in</h1>

        {error === "not_authorized" && (
          <p className="mb-6 border border-border bg-muted px-4 py-3 text-sm text-foreground">
            That Google account isn&apos;t on the admin allowlist. Ask a super
            admin to add you.
          </p>
        )}

        <a
          href={`${API_URL}/auth/google`}
          className="flex h-14 w-full items-center justify-center gap-3 bg-accent text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          <GoogleMark />
          Continue with Google
        </a>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M21.6 12.23c0-.68-.06-1.34-.17-1.98H12v3.75h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.24c1.9-1.75 3-4.32 3-7.3Z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 4.97-.89 6.63-2.42l-3.24-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="currentColor"
        d="M6.41 13.92a5.99 5.99 0 0 1 0-3.84V7.49H3.06a10 10 0 0 0 0 9.02l3.35-2.59Z"
      />
      <path
        fill="currentColor"
        d="M12 6.04c1.47 0 2.79.5 3.82 1.49l2.87-2.87A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.94 5.49l3.35 2.59C7.2 7.8 9.4 6.04 12 6.04Z"
      />
    </svg>
  );
}
