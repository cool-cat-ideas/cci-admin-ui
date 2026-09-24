# Contribute and release

Fix shared behavior in [CCI Admin UI](https://github.com/cool-cat-ideas/cci-admin-ui), then consume the resulting versioned packages. Avoid copying components into each product: copies stop receiving later fixes.

## Prepare a local candidate

From the UI repository:

```sh
npm ci
npm test
npm run release
node scripts/prepare-product.mjs /absolute/path/to/product
```

`npm test` builds packages and runs their tests. `npm run release` prepares `.tgz` archives, SHA-256 files and `releases/packages.json`; it does not publish a tag or create product ZIPs. `prepare-product.mjs` installs candidate archives into the chosen product while retaining public release URLs and refreshing integrity hashes in its lockfile. Rebuild the product with its normal command and review the dependency diff.

Use a new package version for changes to a published release. Never replace an archive under an existing version: lockfile integrity is a reproducibility guarantee. Local candidate replacement is only for an unpublished release.

## Keep one visual contract

- Use shared `Button` variants for links, buttons and clickable cards. Test hover, keyboard focus and disabled state.
- Use shared field controls; a native unstyled select is not a substitute for the shared `Select`.
- Keep alert, toast and badge colors in the common theme. Do not apply broad descendant color or background overrides.
- Use `formatAdminDateTime` for lists and status panels, including missing and inactive-license states.
- Shared panels use the `cci-nm` token namespace even in other products. The theme helper includes it; a product-only CSS scan does not.
- Extend the public add-on safelist for a new supported add-on class. A Free build must not scan private Pro source files.

## Verify a change

Run package tests and rebuild each affected consumer. In the actual admin pages check desktop and narrow screens, long labels, keyboard navigation, visible hover/focus, portalled selects, errors and toasts. Test active and inactive license states, empty/failed news requests and the normal data state. Check overflow and the browser console.

For a style change, inspect the generated CSS loaded by the browser. Editing a canonical source file is not enough if the product or demo still serves an earlier bundle.

## Publish in dependency order

Maintain the [changelog](https://github.com/cool-cat-ideas/cci-admin-ui/blob/main/CHANGELOG.md)
in the same change as a public behavior or API change. Add a short entry under
`Unreleased`, describing the effect for users or integrating developers. Include
migration steps for breaking changes; keep internal discussions and planned work
out of release notes.

Before publishing, move those entries into the matching package version section
and add the actual release date. Keep an empty `Unreleased` section for the next
cycle. Include the changelog in the release commit before creating its tag, and
use that version's entries in the GitHub release notes.

1. Publish the public UI source tag and matching npm archives/checksums.
2. Confirm a clean product checkout can run `npm ci` without sibling repositories or private credentials.
3. Build and publish dependent products with their matching lockfiles and license notices.

The private `cci_admin_ui_pro` repository has a separate release workflow. Its authorization code is not part of this public library. Pro products still consume the same public controls as their Free hosts.

The versioned Markdown in the UI repository is the documentation source. Keep the website's matching `docs/products/cci-admin-ui` copy synchronized when a public contract changes. Documentation is deployed with the application; it does not require a Payload content seed.
