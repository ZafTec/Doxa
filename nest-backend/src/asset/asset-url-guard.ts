import { BadRequestException } from '@nestjs/common';
import dns from 'node:dns';

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '0.0.0.0',
  '::1',
  '169.254.169.254',
]);

function isPrivateIPv4(address: string): boolean {
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(address);
  if (!match) return false;

  const [a, b] = [Number(match[1]), Number(match[2])];
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254)
  );
}

function isPrivateIPv6(address: string): boolean {
  const normalized = address.toLowerCase();

  if (normalized === '::' || normalized === '::1') return true;
  // Link-local (fe80::/10) and unique local (fc00::/7, i.e. fc.. or fd..).
  if (
    /^fe[89ab][0-9a-f]:/.test(normalized) ||
    /^f[cd][0-9a-f]{2}:/.test(normalized)
  ) {
    return true;
  }
  // IPv4-mapped/compatible IPv6 (::ffff:127.0.0.1, ::127.0.0.1).
  const mapped = /^::(ffff:)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/.exec(
    normalized,
  );
  if (mapped) return isPrivateIPv4(mapped[2]);

  return false;
}

function isPrivateAddress(address: string, family: number): boolean {
  return family === 6 ? isPrivateIPv6(address) : isPrivateIPv4(address);
}

/**
 * Basic SSRF guard for admin-supplied image URLs: rejects loopback,
 * private, link-local, and cloud-metadata addresses. Checks both the
 * literal hostname/IP in the URL and every address it actually resolves
 * to via DNS (defeats decimal/octal/hex IP-literal obfuscation and
 * hostnames that simply point at an internal address). Not fully
 * DNS-rebinding-proof - a resolver that returns a public IP here and a
 * private one at the moment `fetch` connects could still slip through.
 * Combined with `redirect: "manual"` at the fetch call site (reject any
 * redirect outright) and admin-only auth, this is a reasonable bar for a
 * feature restricted to trusted SUPER_ADMIN/EDITOR accounts, not public
 * input.
 */
export async function assertPublicHttpUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new BadRequestException('Invalid URL');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new BadRequestException('URL must use http or https');
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    BLOCKED_HOSTNAMES.has(hostname) ||
    isPrivateIPv4(hostname) ||
    isPrivateIPv6(hostname)
  ) {
    throw new BadRequestException('URL host is not allowed');
  }

  let resolved: dns.LookupAddress[];
  try {
    resolved = await dns.promises.lookup(hostname, {
      all: true,
      verbatim: true,
    });
  } catch {
    throw new BadRequestException('Could not resolve URL host');
  }

  if (
    resolved.length === 0 ||
    resolved.some((r) => isPrivateAddress(r.address, r.family))
  ) {
    throw new BadRequestException('URL host is not allowed');
  }

  return url;
}
