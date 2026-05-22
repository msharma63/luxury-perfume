# Maison — Luxury Perfume Shopify Theme

A from-scratch Shopify theme for a small (<20 SKU) luxury fragrance house. Built directly without forking Dawn — no upstream baggage, every file authored for the brand. Uses Shopify Online Store 2.0 (JSON templates, sections everywhere, metafields).

## Quick start

You don't yet have Shopify CLI or Node installed. Once you do:

```powershell
# 1. Install Node.js (LTS) from https://nodejs.org
# 2. Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# 3. Create a free Shopify Partner account and a development store
#    https://partners.shopify.com/

# 4. From this folder, log in and pair to your dev store
cd C:\Users\LENOVO\Projects\luxury-perfume
shopify theme dev --store your-store.myshopify.com
```

`shopify theme dev` runs a local hot-reload preview at http://127.0.0.1:9292. Push to the store with `shopify theme push --unpublished`, then publish via the admin.

## Required setup in the Shopify admin

Before the theme renders correctly, configure these in the dev store:

### 1. Metafield definitions (Settings → Custom data → Products)

Create each under namespace `custom`:

| Key | Type |
|---|---|
| `notes_top` | List of single-line text |
| `notes_heart` | List of single-line text |
| `notes_base` | List of single-line text |
| `olfactory_family` | Single-line text (preset list: Floral, Woody, Oriental, Fresh) |
| `olfactory_subfamily` | Single-line text |
| `concentration` | Single-line text (preset: Eau de Parfum, Parfum, Eau de Toilette) |
| `perfumer_name` | Single-line text |
| `perfumer_page` | Page reference |
| `year_launched` | Integer |
| `inspiration` | Rich text |
| `longevity_hours` | Integer |
| `sillage` | Single-line text (preset: Intimate, Moderate, Strong) |
| `gender_expression` | Single-line text (preset: Feminine, Masculine, Unisex) |
| `related_products` | List of product references |

Article metafields (under `custom`):
- `featured_products` — list of product references

### 2. Search & Discovery app (free, install from Shopify App Store)

Configure filters on collections:
- Olfactory family (`custom.olfactory_family`)
- Concentration (`custom.concentration`)
- Notes (top/heart/base)
- Gender expression (`custom.gender_expression`)
- Size (variant option)
- Price (native)
- Availability (hide-OOS toggle)

Add synonyms: oud ↔ agarwood, EDP ↔ eau de parfum.

### 3. Collections

- `all` — automatic, all products (used as "The Collection")
- `floral`, `woody`, `oriental`, `fresh` — automatic, rule: `Product metafield custom.olfactory_family equals <family>`

### 4. Pages

- `the-house` — template: `page.story`
- `the-perfumer` (or one per perfumer) — template: `page.story`
- `discovery-set` — template: `page.story`
- `contact` — template: `page.contact`

### 5. Blog

- Create blog handle `journal`
- Article tags: `Notes`, `Rituals`, `People`, `Atelier`

### 6. Customer accounts

Settings → Customer accounts → enable **New customer accounts** (passwordless OTP). Apply brand tokens (logo, colours).

### 7. Fonts

The theme expects three woff2 files in `/assets/`:
- `italiana-400.woff2`
- `inter-400.woff2`
- `inter-500.woff2`

Download Italiana and Inter from Google Fonts (or use a foundry licence), convert to woff2 (e.g., google-webfonts-helper), subset to Latin + Latin Extended, and drop into `assets/`. The CSS and preload links already reference these filenames.

## Theme architecture

```
assets/         tokens.css, components.css, fonts.css, global.js, woff2 fonts
config/         settings_schema.json, settings_data.json
layout/         theme.liquid
locales/        en.default.json (all copy)
sections/       merchant-editable building blocks + sections groups
snippets/       atomic partials (meta-tags, product-card, price, etc.)
templates/      JSON: index, product, collection, page.*, blog, article,
                cart, search, customers/*
                Liquid: 404, gift_card
```

See `C:\Users\LENOVO\.claude\plans\can-you-design-a-unified-peach.md` for the full design plan, design system tokens, and build sequence.

## Development discipline

- Merchants edit *content* via theme editor blocks (home modules, story page sections). Merchants do not edit *brand chrome* (header, footer, cart drawer, product card, account templates) — these are hardcoded.
- Champagne accent (`#C9A96E`) is for hover states and small accents only — never body copy or large surfaces.
- Body line-height `1.7`, display line-height `1.0–1.15`. Generous whitespace is the luxury cue.
- All copy lives in `locales/en.default.json` from day one. Never hard-code user-facing strings in Liquid.
- Run `shopify theme check` before each commit. Treat warnings as errors.
