import { BadRequestException } from '@nestjs/common';
import type dns from 'node:dns';

type LookupAddress = { address: string; family: number };

const lookupMock = jest.fn<
  Promise<LookupAddress[]>,
  Parameters<typeof dns.promises.lookup>
>();

jest.mock('node:dns', () => ({
  promises: {
    lookup: (...args: unknown[]) => lookupMock(...(args as [string])),
  },
}));

import { assertPublicHttpUrl } from './asset-url-guard';

describe('assertPublicHttpUrl', () => {
  beforeEach(() => {
    lookupMock.mockReset();
  });

  it('accepts a URL that resolves to a public address', async () => {
    lookupMock.mockResolvedValue([{ address: '93.184.216.34', family: 4 }]);

    const url = await assertPublicHttpUrl('https://example.com/image.jpg');

    expect(url.hostname).toBe('example.com');
  });

  it('rejects a non-http(s) protocol before ever touching DNS', async () => {
    await expect(
      assertPublicHttpUrl('ftp://example.com/x.jpg'),
    ).rejects.toThrow(BadRequestException);
    expect(lookupMock).not.toHaveBeenCalled();
  });

  it('rejects a malformed URL', async () => {
    await expect(assertPublicHttpUrl('not a url')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects literal loopback hostnames without needing DNS', async () => {
    await expect(assertPublicHttpUrl('http://localhost/x.jpg')).rejects.toThrow(
      BadRequestException,
    );
    expect(lookupMock).not.toHaveBeenCalled();
  });

  it('rejects decimal-obfuscated loopback IPv4 literals', async () => {
    // 2130706433 == 127.0.0.1
    await expect(
      assertPublicHttpUrl('http://2130706433/x.jpg'),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects shorthand loopback IPv4 literals', async () => {
    await expect(assertPublicHttpUrl('http://127.1/x.jpg')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects a hostname that DNS-resolves to a private address', async () => {
    lookupMock.mockResolvedValue([{ address: '10.0.0.5', family: 4 }]);

    await expect(
      assertPublicHttpUrl('https://internal.example.com/x.jpg'),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects if any resolved address (multi-A-record) is private', async () => {
    lookupMock.mockResolvedValue([
      { address: '93.184.216.34', family: 4 },
      { address: '192.168.1.1', family: 4 },
    ]);

    await expect(
      assertPublicHttpUrl('https://example.com/x.jpg'),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects IPv6 loopback and link-local resolutions', async () => {
    lookupMock.mockResolvedValue([{ address: '::1', family: 6 }]);
    await expect(
      assertPublicHttpUrl('https://example.com/x.jpg'),
    ).rejects.toThrow(BadRequestException);

    lookupMock.mockResolvedValue([{ address: 'fe80::1', family: 6 }]);
    await expect(
      assertPublicHttpUrl('https://example.com/x.jpg'),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects when DNS resolution fails', async () => {
    lookupMock.mockRejectedValue(new Error('ENOTFOUND'));

    await expect(
      assertPublicHttpUrl('https://nowhere.invalid/x.jpg'),
    ).rejects.toThrow(BadRequestException);
  });
});
