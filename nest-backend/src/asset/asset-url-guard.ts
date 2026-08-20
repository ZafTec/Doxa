import { BadRequestException } from '@nestjs/common';

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '0.0.0.0',
  '::1',
  '169.254.169.254',
]);

function isPrivateIPv4(hostname: string): boolean {
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(hostname);
  if (!match) return false;

  const [a, b] = [Number(match[1]), Number(match[2])];
  return (
    a === 10 ||
    a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254)
  );
}

/**
 * Basic SSRF guard for admin-supplied image URLs: rejects loopback, private,
 * and link-local (cloud metadata) addresses. This is a literal-hostname
 * check, not DNS-rebinding-proof - acceptable here because the endpoint is
 * restricted to authenticated SUPER_ADMIN/EDITOR admins, not public input.
 */
export function assertPublicHttpUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new BadRequestException('Invalid URL');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new BadRequestException('URL must use http or https');
  }

  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname) || isPrivateIPv4(hostname)) {
    throw new BadRequestException('URL host is not allowed');
  }

  return url;
}
