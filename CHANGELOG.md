# Changelog

Notable changes to CCI Admin UI and its five versioned packages are recorded here.
All packages share the same release version. Planned work belongs in issues;
`Unreleased` contains implemented changes awaiting the next release.

## Unreleased

No changes yet.

## 1.0.0

Initial public release.

### Added

- Shared React layouts, navigation, cards and form controls for CCI Blog, CCI Nice Menu, WP Posts Carousel and Cookie Consent administration screens.
- Common buttons, selects, checkboxes, tooltips, alerts, toasts and status badges, with consistent brand colors and interaction states across products.
- Reusable license status cards, product news and version panels, template catalogs and review prompts. Products supply their data, translations and actions.
- Shared date formatting using `YYYY-MM-DD HH:mm`, preserving site-local calendar values and applying the configured time zone to timestamps.
- API transport and adapters for WordPress and PrestaShop, plus a UI bridge for media controls supplied by the host product.
- Public source, integration examples and build tools for `@cci/admin-ui`, `@cci/admin-theme`, `@cci/admin-core`, `@cci/wp-adapter` and `@cci/presta-adapter`. Versioned release archives include source and compiled assets and are pinned by product lockfiles.

### Fixed

- Creation actions now use the same primary button colors and hover, focus and disabled states across product themes.
- Failed news requests are no longer treated or cached as an empty news list; successful responses share a validated cache.
- Date formatting handles SQL calendar dates, Unix timestamps and time-zone offsets consistently and rejects invalid dates.

### Integration notes

Each product bundles the shared UI into its own assets; site owners do not install
a separate framework. Public UI packages contain presentation components and
API adapters. License verification and premium feature implementations remain
in the products' private code.
