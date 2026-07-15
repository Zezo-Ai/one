# Sunstone translations

## Runtime architecture

`ProvidersModule` owns the public translation API:

- `TranslationProvider` loads the active locale and provides translation state.
- `useTranslation` translates values inside components and hooks.
- `Translate` is the declarative equivalent for JSX.
- `formatTranslation` formats messages outside React.
- `translateText` and `formatTranslationText` translate catalog-backed
  segments in legacy composed UI strings while preserving unknown runtime
  values.

Module Federation executes exposed modules in each consumer's Webpack runtime.
The translation context is therefore registered on the shared global object with
`Symbol.for(...)`. Do not replace it with a module-local `createContext()` call;
that isolates remote consumers from the root provider.

## Catalog workflow

The source catalog is generated from
`src/modules/constants/translates.js`, which is the authoritative message list.

1. Run `npm run pot` to regenerate
   `src/client/assets/languages/messages.pot`.
2. Upload the POT resource to the
   [OpenNebula Transifex project](https://explore.transifex.com/opennebula/one/).
3. Download reviewed PO catalogs into `src/client/assets/languages`.
4. Run `npm run po2json` to regenerate the browser locale assets. PO inputs
   are preserved; pass `-- --remove-source` only for packaging workflows that
   explicitly require their removal.

An untranslated or missing message intentionally falls back to its English
source text. Empty translations are never rendered as blank UI.

The current browser catalogs were also seeded with exact source-text matches
from the last reviewed legacy Sunstone PO catalogs. Current FireEdge
translations take precedence, and entries with incompatible interpolation
placeholders are rejected.

## Adding UI text

Add user-facing text to `T` in `src/modules/constants/translates.js`, consume the
constant through the translation API, and regenerate the POT. Avoid embedding
new user-facing English strings directly in components or schemas.

Use `translate` for normal messages and interpolation tuples. Use
`translateText` only at presentation boundaries such as buttons, headings, and
metadata that may still receive concatenated `T` values. Resource names, user
names, group names, IDs, and other runtime data should remain outside the
translation call whenever the component can distinguish them.
