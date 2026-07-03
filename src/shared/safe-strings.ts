/**
 * Patterns shared by the Zod schemas (build-time validation) and the browser
 * UI (defense in depth). The UI re-checks these because the embeddable bundle
 * can be pointed at an arbitrary feedUrl: strings from a feed the pipeline
 * didn't emit still end up in the copyable `composer require` command, and a
 * shell metacharacter there would ride the user's clipboard into a terminal.
 */

/** Packagist package name, e.g. "acme/module-widget". */
export const PACKAGE_NAME_PATTERN = /^[a-z0-9]([_.-]?[a-z0-9]+)*\/[a-z0-9](([_.]|-{1,2})?[a-z0-9]+)*$/;

/**
 * Package or Magento version string, e.g. "1.2.3", "v2.0.0-beta.1",
 * "dev-feature/foo" — letters, digits, and . _ + / - only, so it can never
 * carry shell metacharacters (spaces, ;, &, $, quotes, backticks…).
 */
export const VERSION_PATTERN = /^[A-Za-z0-9._+/-]{1,100}$/;
