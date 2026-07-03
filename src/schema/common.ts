import { z } from 'zod';
import { PACKAGE_NAME_PATTERN, VERSION_PATTERN } from '../shared/safe-strings.js';

/** Current published schema version for /api/v1 artifacts. */
export const SCHEMA_VERSION = 1 as const;

/** Packagist package name, e.g. "acme/module-widget". */
export const packageName = z
  .string()
  .regex(
    PACKAGE_NAME_PATTERN,
    'must be a valid Packagist package name (vendor/package, lowercase)',
  );

/** Vendor slug — the Packagist vendor namespace, e.g. "acme". */
export const vendorSlug = z
  .string()
  .regex(/^[a-z0-9]([_.-]?[a-z0-9]+)*$/, 'must be a lowercase Packagist vendor namespace');

/** Category slug, e.g. "payments". */
export const categorySlug = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'must be a lowercase kebab-case slug');

/**
 * A link safe to render as an href. Plain z.url() accepts any parseable URL —
 * including javascript: — and repository/evidence/docs URLs end up as <a href>
 * on the site and in the embeddable UI, so restrict to web protocols.
 */
export const httpUrl = z.url({ protocol: /^https?$/ });

/**
 * A package or Magento version string, e.g. "1.2.3", "v2.0.0-beta.1",
 * "dev-feature/foo". Deliberately narrow: these strings are embedded in the
 * copyable `composer require` command, so shell metacharacters (spaces, ;,
 * &, $, quotes, backticks…) must never pass validation.
 */
export const versionString = z
  .string()
  .regex(VERSION_PATTERN, 'version may only contain letters, digits, and . _ + / - (max 100 chars)');

/** ISO 8601 timestamp. */
export const isoDateTime = z.iso.datetime();

/** ISO 8601 calendar date (YYYY-MM-DD). */
export const isoDate = z.iso.date();

export const qualityTier = z.enum([
  'strict-compliant',
  'no-errors',
  'ready-to-install',
  'needs-help',
]);
export type QualityTier = z.infer<typeof qualityTier>;

export const buildStatus = z.enum(['passing', 'failing', 'unknown']);
export type BuildStatus = z.infer<typeof buildStatus>;

export const partnerTier = z.enum(['platinum', 'gold', 'silver', 'bronze']);
export type PartnerTier = z.infer<typeof partnerTier>;

export const warningSeverity = z.enum(['info', 'derank', 'hide']);
export type WarningSeverity = z.infer<typeof warningSeverity>;
