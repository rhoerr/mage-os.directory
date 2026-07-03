import { describe, expect, it } from 'vitest';
import { sanitizeReadmeHtml } from '../src/pipeline/sanitize.js';

describe('sanitizeReadmeHtml', () => {
  it('passes null through', () => {
    expect(sanitizeReadmeHtml(null)).toBeNull();
  });

  it('keeps typical README markup', () => {
    const html =
      '<h1>Widget</h1><p>Install with <code>composer require acme/widget</code>.</p>' +
      '<table><thead><tr><th align="left">A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>' +
      '<pre><code>bin/magento setup:upgrade</code></pre>';
    expect(sanitizeReadmeHtml(html)).toBe(html);
  });

  it('strips scripts, styles, and event handlers', () => {
    const dirty =
      '<p onmouseover="steal()">hi</p><script>alert(1)</script><style>*{display:none}</style>' +
      '<img src="https://example.com/x.png" onerror="alert(1)">';
    const clean = sanitizeReadmeHtml(dirty)!;
    expect(clean).not.toContain('script');
    expect(clean).not.toContain('style');
    expect(clean).not.toContain('onerror');
    expect(clean).not.toContain('onmouseover');
    expect(clean).toContain('<p>hi</p>');
    expect(clean).toContain('<img src="https://example.com/x.png" />');
  });

  it('strips iframes and non-web URL schemes', () => {
    const dirty =
      '<iframe src="https://evil.example"></iframe>' +
      '<a href="javascript:alert(1)">click</a><a href="https://ok.example/docs">docs</a>';
    const clean = sanitizeReadmeHtml(dirty)!;
    expect(clean).not.toContain('iframe');
    expect(clean).not.toContain('javascript:');
    expect(clean).toContain('href="https://ok.example/docs"');
  });

  it('forces rel="nofollow noopener" on links', () => {
    const clean = sanitizeReadmeHtml('<a href="https://example.com">x</a>')!;
    expect(clean).toContain('rel="nofollow noopener"');
  });

  it('returns null when nothing survives', () => {
    expect(sanitizeReadmeHtml('<script>alert(1)</script>')).toBeNull();
    expect(sanitizeReadmeHtml('   ')).toBeNull();
  });
});
