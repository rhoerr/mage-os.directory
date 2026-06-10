# Mage-OS Extension Directory

An interface for exploring and discovering open source and free modules (and services) for Mage-OS / Magento — surfaced through the Mage-OS admin panel, and potentially mage-os.org.

## Concept

Merchants and developers have no easy, trustworthy way to discover quality open source extensions. This project aims to fix that with:

- **Discovery Service** — a standalone app aggregating package data from sources like [PackageMaven](https://package-maven.com/) and Packagist, layered with a Mage-OS-curated trust overlay (partner levels, quality indicators, editorial picks), exposed via a clean API.
- **Admin module** — a thin Magento/Mage-OS module that shows what's installed (via composer introspection) and embeds the Discovery Service to browse the catalog in-admin.

Key principles:

- **Read-only in production** — no installs from the admin panel; "install" means a copyable `composer require` command.
- **Trust signals** — combination of automated indicators (compatibility, quality tiers, build status) and manual Mage-OS curation.
- **Decoupled** — the Discovery Service works inside or independently of Mage-OS, so it can power a public site, CLI tools, or CI checks later.

## Background

- Original discussion: [mage-os-lab discussion #3](https://github.com/orgs/mage-os-lab/discussions/3)
- Initial scoping notes: [docs/initial-scope.md](docs/initial-scope.md)

## Status

Early concept / scoping. Nothing is built yet — see the docs for the current thinking.
