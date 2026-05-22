# Maison — Luxury Perfume Brand Site

A small static website for a luxury perfume atelier called *Maison*. Pure HTML, CSS and a sprinkle of JavaScript. No framework, no build step, no database. Deployed on Vercel.

Live URL: _(set after first deploy — see `Deploying` below)_

## Pages

| Path | What it is |
|---|---|
| `/` ([index.html](index.html)) | Home: hero, family tiles, the 30-card collection grid, brand story, journal teaser, newsletter |
| `/collection` ([collection.html](collection.html)) | Full collection grid — 30 fragrance cards, family-tinted bottle illustrations |
| `/the-house` ([the-house.html](the-house.html)) | Brand story (long-form prose) |
| `/journal` ([journal.html](journal.html)) | Journal index — six placeholder articles across Notes / Rituals / People |
| `/contact` ([contact.html](contact.html)) | Atelier address, email, press contact |

Vercel's `cleanUrls: true` (see [vercel.json](vercel.json)) strips the `.html` from URLs in production.

## File structure

```
luxury-perfume/
├── index.html              ← home
├── collection.html         ← /collection
├── the-house.html          ← /the-house
├── journal.html            ← /journal
├── contact.html            ← /contact
├── assets/
│   ├── tokens.css          ← design tokens, type, colour, floral background
│   ├── components.css      ← buttons, fields, cards, grid utilities
│   ├── site.css            ← page-specific styles (header, hero, demo grid, footer)
│   └── global.js           ← mobile menu toggle, no-op newsletter form
├── shopify-theme/          ← archived original Shopify theme (see below)
├── vercel.json             ← cleanUrls + long-cache for /assets/*
└── README.md
```

## The "thirty compositions" data

The 30 fragrances are defined as a single JS array at the bottom of [index.html](index.html) and [collection.html](collection.html). To add, remove, or edit one, change the array in **both** places. Each entry is:

```js
{ name: "Cuir Bohème", family: "Oriental", notes: "Leather · Oud · Saffron", price: 320, size: 50 }
```

Valid families: `Oriental`, `Floral`, `Woody`, `Fresh`. The CSS picks the bottle glass colour from the family name.

## Design tokens

Defined in [assets/tokens.css](assets/tokens.css). Key values:

- **Ink** `#0E0E0C` — primary text
- **Paper** `#FAF7F2` — page background
- **Champagne** `#C9A96E` — hover and accent only (never large surfaces)
- **Fonts** — Italiana for display, Inter for UI, both loaded from Google Fonts
- **Container max** — 1440px
- **Section padding** — 144px desktop, 80px mobile
- **Floral background** — inline SVG data-URI, repeating 160×160 tile at 16% opacity

## Running locally

No build step. Any static file server works:

```powershell
# pick one:
npx serve .
python -m http.server 4000
```

Then open http://localhost:4000 (or whichever port your server prints).

## Deploying

The site is set up to deploy on **Vercel** by importing the GitHub repo:

1. Push your changes to `main` on GitHub
2. Go to https://vercel.com/new
3. Sign in with GitHub, "Import" → pick `msharma63/luxury-perfume`
4. Framework preset: **Other** (it's plain static)
5. Build/output directory: leave empty (Vercel auto-detects)
6. Click **Deploy**

Every subsequent push to `main` auto-deploys. Pull requests get unique preview URLs.

Custom domain: in the project's Vercel dashboard → **Settings** → **Domains** → add your domain (e.g. `maison.com`). Vercel walks you through the DNS records.

## What's archived in `shopify-theme/`

Earlier in the project this was built as a Shopify Online Store 2.0 theme — a complete theme with Liquid templates, JSON sections, metafields, and dynamic product rendering. That direction required a paid Shopify store ($29/mo+) to actually run. Since the brief was a *brand showcase site, no real sales*, the project was rebuilt as a static site at the repo root.

The Shopify theme lives in [`shopify-theme/`](shopify-theme/) — fully working code if you ever want to switch direction. See [shopify-theme/SETUP.md](shopify-theme/SETUP.md) for what'd be needed to bring it back to life.

## Adding real sales later (if needed)

The static site can grow into e-commerce two main ways:

- **Drop in a payment widget** — Stripe Payment Links, Shopify Buy Buttons, etc. Each fragrance card becomes a checkout link. No backend needed, but no cart either.
- **Move to a small framework with a checkout** — Astro + Stripe, or Next.js + Stripe. The current HTML/CSS port cleanly into either.

Or restore the [shopify-theme/](shopify-theme/) version, pair it with a paid Shopify plan, and get the full store experience.
