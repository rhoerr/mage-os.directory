import sanitizeHtml from 'sanitize-html';

/**
 * Build-time sanitizer for third-party README HTML. This is the invariant
 * behind packageDetail.readmeHtml's "sanitized at build time" contract: the
 * merge step routes every readmeHtml through here, so any future fetcher
 * (GitHub's rendered README, M4a) inherits it instead of having to remember
 * it. The output lands in `set:html` on detail pages — treat the input as
 * hostile.
 *
 * Allowlist follows what GitHub's own README rendering produces: structural
 * and inline markup, tables, code blocks, images, and links. No scripts,
 * styles, iframes, event handlers, or non-web URL schemes.
 */
export function sanitizeReadmeHtml(html: string | null): string | null {
  if (html === null) return null;
  const clean = sanitizeHtml(html, {
    allowedTags: [
      'a', 'abbr', 'b', 'blockquote', 'br', 'code', 'dd', 'del', 'details',
      'div', 'dl', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i',
      'img', 'ins', 'kbd', 'li', 'ol', 'p', 'pre', 'q', 's', 'samp', 'small',
      'span', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'th',
      'thead', 'tr', 'ul',
    ],
    allowedAttributes: {
      // rel is allowlisted only so the transform below can force its value —
      // an author-supplied rel is overwritten, not preserved.
      a: ['href', 'title', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      td: ['align', 'colspan', 'rowspan'],
      th: ['align', 'colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https'],
    // Relative image/link URLs would resolve against the directory's own
    // origin and dangle; drop them rather than serve broken references.
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'nofollow noopener' }),
    },
  }).trim();
  return clean === '' ? null : clean;
}
