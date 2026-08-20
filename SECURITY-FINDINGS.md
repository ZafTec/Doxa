# Security Findings

## 2026-08-20 - SSRF in admin URL-based asset import

**Status:** Fixed
**Severity:** Medium (endpoint is admin-only, authenticated `SUPER_ADMIN`/`EDITOR`, not public input)
**Files:** `nest-backend/src/asset/asset-url-guard.ts`, `nest-backend/src/asset/asset.service.ts` (`importFromUrl`)

Automated commit review flagged SSRF risk in the `POST /asset/uploads/from-url` flow, which
fetches an admin-supplied URL server-side and writes the bytes to MinIO. The original guard
(`assertPublicHttpUrl`) only checked the literal hostname string against a denylist, which had
three gaps:

1. **DNS bypass** - a public-looking hostname that resolves to a private/loopback address
   (e.g. via a malicious DNS record) was not checked at all.
2. **Numeric IP obfuscation** - decimal (`http://2130706433/`), octal, or shorthand
   (`http://127.1/`) IP literals bypassed the dotted-quad regex used for the IPv4 check.
3. **Redirect bypass** - a URL on an allowed public host that responded with a `3xx` to an
   internal address would have been followed by `fetch`'s default redirect behavior, fetching
   from the internal target despite the initial URL passing the guard.
4. IPv6 loopback/private/link-local ranges (`::1`, `fe80::/10`, `fc00::/7`, IPv4-mapped
   `::ffff:127.0.0.1`) were not checked beyond the literal `::1` string.

**Fix:**

- `assertPublicHttpUrl` now also resolves the hostname via `dns.promises.lookup(..., { all:
  true })` and rejects if any resolved address is private/loopback/link-local (this also closes
  the numeric-obfuscation gap, since DNS resolution normalizes any encoding to the real IP).
- Added IPv6 private-range checks (loopback, link-local, ULA, IPv4-mapped).
- The `fetch` call in `importFromUrl` now uses `redirect: "manual"` and explicitly rejects any
  `3xx` response instead of following it.

**Residual risk (accepted):** not fully DNS-rebinding-proof - a resolver that returns a public
IP at guard-check time and a private one a moment later at `fetch`-connect time could still slip
through, since Bun's `fetch` does its own resolution without IP pinning. Given the endpoint
requires authenticated admin access (not public/anonymous input), this residual risk was judged
acceptable rather than adding a custom low-level HTTP client with IP pinning.
