# Choose an integration

CCI Admin UI provides the controls used by CCI administration screens. It is a build dependency for developers, not a WordPress plugin or a PrestaShop module that a site owner installs.

## Start with the smallest change

| Your goal | Supported approach | Guide |
| --- | --- | --- |
| Change a category list, carousel template or storefront menu | Use that product's public filters, templates or extension API. An admin UI build is usually unnecessary. | The product's developer guide |
| Add a setting to an existing product | Import its themed controls; keep persistence in the product. | [Forms and feedback](forms-and-feedback.md) |
| Show license state, installed version or product news | Pass product data to the shared panels. | [Product panels](product-panels.md) |
| Call a WordPress or PrestaShop endpoint | Use the matching adapter and the platform's server-side permissions. | [API clients](api-clients.md) |
| Correct a shared hover, badge, date or validation style | Change the canonical component or theme, then rebuild its consumers. | [Contribute and release](contributing.md) |
| Add an admin screen to a Pro extension | Reuse the host product's component and extension contract. | [Install and build](installation.md) |

## Packages

| Package | Responsibility |
| --- | --- |
| `@cci/admin-ui` | React controls, layouts, alerts, toasts, license cards and news panels |
| `@cci/admin-theme` | Tailwind configuration, brand tokens, shared CSS and dynamic class lists |
| `@cci/admin-core` | JSON transport and response normalization |
| `@cci/wp-adapter` | WordPress REST requests with a nonce |
| `@cci/presta-adapter` | PrestaShop AJAX action mapping and administrator token |

The public repository is [cci-admin-ui](https://github.com/cool-cat-ideas/cci-admin-ui); its local workspace directory is named `cci_admin_ui`. The separate `cci_admin_ui_pro` repository is not required to build public UI packages or a Free product. License cards only display state and call product callbacks; they do not grant access to paid operations. The product backend remains responsible for authorization.

## Scope and compatibility

These guides describe package version 1.0.0. Components use React 19, Radix primitives and Tailwind 3 utilities with the `tw-` prefix. They follow CCI product styles; installing the library does not install shadcn's CLI or replace a product's admin shell.

Use the exported package paths. Source files are included for inspection and contribution, but deep `src` imports are not the integration contract. API examples below use JavaScript/JSX because this release does not ship TypeScript declaration files.

Source, build instructions and license notices accompany the compiled packages. Keep the MIT notice and the notices for bundled third-party dependencies when distributing them.
