import { describe, expect, it } from 'vitest';
import { composerCommand } from '../src/ui/DirectoryBrowser.js';
import { jsonForScript } from '../src/site/lib/data.js';
import { httpUrl, versionString } from '../src/schema/common.js';
import { sourcePackage } from '../src/schema/source.js';

describe('composerCommand against a hostile feed', () => {
  it('builds the normal command for valid entries', () => {
    expect(
      composerCommand([
        { name: 'acme/module-pay', version: '1.2.3' },
        { name: 'acme/module-search', version: null },
      ]),
    ).toBe('composer require acme/module-pay:^1.2.3 acme/module-search');
  });

  it('drops versions carrying shell metacharacters instead of embedding them', () => {
    expect(composerCommand([{ name: 'acme/module-pay', version: '1.0.0; rm -rf ~' }])).toBe(
      'composer require acme/module-pay',
    );
    expect(composerCommand([{ name: 'acme/module-pay', version: '1.0.0 && curl evil' }])).toBe(
      'composer require acme/module-pay',
    );
  });

  it('drops entries whose package name is not a valid Packagist name', () => {
    expect(
      composerCommand([
        { name: 'acme/module-pay; echo pwned', version: null },
        { name: 'acme/module-search', version: '2.0.0' },
      ]),
    ).toBe('composer require acme/module-search:^2.0.0');
  });

  it('returns an empty string when nothing survives', () => {
    expect(composerCommand([{ name: '$(reboot)', version: null }])).toBe('');
  });

  it('accepts composer branch versions', () => {
    expect(composerCommand([{ name: 'acme/module-pay', version: 'dev-feature/foo' }])).toBe(
      'composer require acme/module-pay:^dev-feature/foo',
    );
  });
});

describe('jsonForScript', () => {
  it('escapes < so </script> cannot terminate an inline script block', () => {
    const out = jsonForScript({ description: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</script>');
    expect(out).toContain('\\u003c/script>');
    // Still plain JSON: parses back to the same value.
    expect(JSON.parse(out)).toEqual({ description: '</script><script>alert(1)</script>' });
  });
});

describe('schema hardening', () => {
  it('versionString rejects shell metacharacters and overlong values', () => {
    expect(versionString.safeParse('1.2.3').success).toBe(true);
    expect(versionString.safeParse('v2.0.0-beta.1+build.7').success).toBe(true);
    expect(versionString.safeParse('dev-feature/foo').success).toBe(true);
    expect(versionString.safeParse('1.0.0; rm -rf ~').success).toBe(false);
    expect(versionString.safeParse('1.0.0 2.0.0').success).toBe(false);
    expect(versionString.safeParse('`id`').success).toBe(false);
    expect(versionString.safeParse('').success).toBe(false);
    expect(versionString.safeParse('9'.repeat(101)).success).toBe(false);
  });

  it('httpUrl rejects javascript: and other non-web schemes', () => {
    expect(httpUrl.safeParse('https://example.com/x').success).toBe(true);
    expect(httpUrl.safeParse('http://example.com').success).toBe(true);
    expect(httpUrl.safeParse('javascript:alert(1)').success).toBe(false);
    expect(httpUrl.safeParse('data:text/html,<script>1</script>').success).toBe(false);
    expect(httpUrl.safeParse('vbscript:x').success).toBe(false);
  });

  it('sourcePackage rejects a javascript: repositoryUrl and unsafe versions', () => {
    const base = {
      name: 'acme/module-pay',
      displayName: 'Acme Pay',
      qualityTier: 'no-errors',
    };
    expect(sourcePackage.safeParse(base).success).toBe(true);
    expect(
      sourcePackage.safeParse({ ...base, repositoryUrl: 'javascript:alert(1)' }).success,
    ).toBe(false);
    expect(sourcePackage.safeParse({ ...base, latestVersion: '1.0 || true' }).success).toBe(false);
    expect(
      sourcePackage.safeParse({ ...base, supportedMagento: ['2.4.7', '2.4.6; ls'] }).success,
    ).toBe(false);
  });
});
