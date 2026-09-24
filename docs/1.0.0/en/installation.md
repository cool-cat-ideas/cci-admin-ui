# Install and build

## Work on an existing product

Use Node.js 23.7 or later and npm 11.7 or later, as declared by the library. In a product checkout, run `npm ci`, then its documented build command. The lockfile pins public package archives and their integrity hashes. No sibling UI checkout or private repository is needed for a published release.

The publisher must upload the source tag and matching archives before publishing dependent products. A URL in `package.json` alone does not make a release available. If an archive is not published yet, use the local candidate workflow in [Contribute and release](contributing.md).

## Add the library to a build

For version 1.0.0 the public archive URLs have this form:

```json
{
  "dependencies": {
    "@cci/admin-ui": "https://github.com/cool-cat-ideas/cci-admin-ui/releases/download/v1.0.0/cci-admin-ui-1.0.0.tgz",
    "@cci/admin-theme": "https://github.com/cool-cat-ideas/cci-admin-ui/releases/download/v1.0.0/cci-admin-theme-1.0.0.tgz"
  }
}
```

Install and commit the generated lockfile. Use the peer dependencies declared in the UI package, including React, Lucide, Radix, `class-variance-authority`, `clsx` and `tailwind-merge`. The theme requires Tailwind 3 and PostCSS. Existing CCI products already declare their build dependencies.

Select the product entry point:

| Product | Import | Tailwind namespace |
| --- | --- | --- |
| CCI Blog | `@cci/admin-ui/blog` | `cci-blog` |
| CCI Nice Menu | `@cci/admin-ui/nice-menu` | `cci-nm` |
| WP Posts Carousel | `@cci/admin-ui/wp-carousel` | `cci-wpc` |

The root export exposes factories such as `createButton('blog')`; themed exports provide components already configured for a product. Create factories at module scope, never during rendering.

## Generate shared styles

Example `tailwind.config.cjs` for a Blog extension built with its host:

```js
const { createTailwindConfig } = require('@cci/admin-theme');

module.exports = createTailwindConfig({
  namespace: 'cci-blog',
  content: ['./src/admin-v2/**/*.{js,jsx}'],
  safelistMode: 'shared-ui',
  safelist: ['tw-hidden'],
});
```

`createTailwindConfig(options)` returns a Tailwind 3 configuration. `namespace` is required; `content` adds consumer files; `safelist` adds runtime classes; `plugins` adds Tailwind plugins. The helper also scans the installed UI package. `safelistMode` accepts `shared-ui` for audited consumers or the broader default `all-colors`. It disables preflight, adds the `tw-` prefix and includes shared styles and the common panel namespace.

Include all three layers in the product's CSS input, then load the generated stylesheet once:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Keep `@tailwind base`: shared control rules are added through this layer even though preflight is disabled. Do not replace the generated configuration with a consumer-only class scan; dynamically generated hover, focus and status classes would disappear.

## React and Pro extensions

The product build owns React mounting and platform integration. In WordPress, retain the host's `wp.element` mapping where it already exists. Do not introduce a second React runtime into the same screen.

Pro add-ons reuse the host product's UI and supported extension registration. They do not need another UI bundle or imports from private PHP runtime code. Consult the host product's extension guide for the registration contract; the UI library itself does not define a universal add-on registry.
