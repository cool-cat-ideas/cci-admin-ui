# CCI Admin UI

Shared React components, styles and API adapters for Cool Cat Ideas products.
Free and Pro products consume the same versioned packages. Each product bundles
its dependencies into its own assets; site owners do not install this repository.

## Documentation

Start with the [integration decision guide](docs/1.0.0/en/index.md).
Practical guides cover [installation and styles](docs/1.0.0/en/installation.md),
[forms and feedback](docs/1.0.0/en/forms-and-feedback.md),
[license, version and news panels](docs/1.0.0/en/product-panels.md),
[platform API clients](docs/1.0.0/en/api-clients.md), and
[contribution and releases](docs/1.0.0/en/contributing.md).
These versioned files are also published in the website documentation.

See the [changelog](CHANGELOG.md) for release changes and upgrade notes.

## Build and contribute

Use Node.js 23.7 or later and npm 11.7 or later.

```sh
npm ci
npm test
npm run release
```

`release` builds the JavaScript and prepares npm `.tgz` archives, checksums and
`releases/packages.json`. It does not upload anything or create plugin ZIPs.
The archives contain both compiled JavaScript and its source. Submit shared UI
changes here; product-specific behavior belongs in the product repository.

## Packages

| Package | Purpose |
| --- | --- |
| `@cci/admin-ui` | React components and product themes |
| `@cci/admin-theme` | Tailwind tokens, shared styles and runtime class lists |
| `@cci/admin-core` | API transport and response normalization |
| `@cci/wp-adapter` | WordPress API adapter |
| `@cci/presta-adapter` | PrestaShop API adapter |

License status components display data and invoke callbacks supplied by a
product. They do not authorize premium operations. License verification,
signing keys and premium feature implementations are outside this repository.

The theme's `addon-safelist.cjs` lists utility classes supported by carousel
add-on panels. Extend that style contract when introducing a new add-on layout;
Free builds must not scan private Pro repositories for CSS classes.

## Use in products

Products pin release archive URLs and their integrity hashes in npm lockfiles.
A released product builds with `npm ci` and its normal build command, without
cloning this repository or accessing a private framework.

During coordinated local development, first build this repository, then run:

```sh
node scripts/prepare-product.mjs /absolute/path/to/product
```

This installs the local candidate archives and updates their integrity hashes
while retaining the public release URLs. Commit the product lockfile together
with the corresponding dependency update. This command is for preparing a new
release, not for silently changing an already published dependency.

## Release order

Publish this source repository and its matching `.tgz` release assets first.
Then publish products that depend on that release. Until those assets exist,
external `npm ci` cannot resolve the new release; local preparation remains
available. A published tag and its archives are immutable. Increment the UI
package versions for subsequent releases.

## License

MIT. Third-party dependencies retain their own licenses. Public source and build
instructions accompany the compiled packages used by WordPress plugins.
