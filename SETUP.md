# Setup — getting Maison onto a live Shopify store

This is a one-time checklist. Work top-to-bottom; each section is self-contained.

Total time: roughly **90 minutes**, most of which is admin clicking.

---

## 0. Prerequisites (already done on this machine)

- [x] Node.js 24 LTS installed (`node --version`)
- [x] Shopify CLI installed globally (`shopify version` → 4.x)
- [x] Git + GitHub CLI installed
- [x] Theme source in `c:\Users\LENOVO\Projects\luxury-perfume`

If you ever move to a new machine: install Node from https://nodejs.org, then
`npm install -g @shopify/cli`.

---

## 1. Create a Shopify Partner account

A Partner account is free and lets you make unlimited dev stores.

1. Go to https://partners.shopify.com/signup
2. Sign up with your email
3. Verify the email link
4. Skip the "tell us about your business" forms — defaults are fine

---

## 2. Create a development store

1. In the Partner dashboard, sidebar → **Stores** → **Add store**
2. Choose **Create development store**
3. Store name: anything, e.g. `maison-dev`
4. Store URL will be `maison-dev.myshopify.com` (or whatever name you pick)
5. Purpose: **Build a new app or theme**
6. Build version: **Developer Preview** (latest)
7. Submit. The store takes ~30 seconds to spin up.

Once created, click into the store → **Log in to Shopify admin**. Bookmark
that URL.

---

## 3. Add the three font files

The theme references three woff2 fonts that are not in the repo (font
licences forbid redistribution). Without them the theme renders in serif/sans
fallbacks — readable but off-brand.

1. Go to https://fonts.google.com/specimen/Italiana → Download family
2. Go to https://fonts.google.com/specimen/Inter → Download family
3. Convert the TTFs to woff2:
   - Easiest: https://google-webfonts-helper.herokuapp.com/fonts/italiana — pick
     "Modern Browsers", Latin + Latin Ext, copy the woff2 download URLs
   - Same for Inter (weights 400 and 500)
4. Rename to exactly: `italiana-400.woff2`, `inter-400.woff2`, `inter-500.woff2`
5. Drop all three into `assets/` in this repo
6. Commit them: `git add assets/*.woff2 && git commit -m "Add brand fonts"`

After this, `shopify theme check` will report 0 errors.

---

## 4. Pair Shopify CLI to your dev store

From this folder:

```powershell
shopify theme dev --store maison-dev.myshopify.com
```

(Substitute your actual store handle.)

- A browser tab opens for the Shopify login. Sign in with the Partner
  account email.
- Approve the CLI permission prompt.
- Once paired, the CLI starts a local dev server at http://127.0.0.1:9292.
  Hot reload works on Liquid/CSS edits.
- Ctrl+C to stop.

The store credential is cached, so future `shopify theme ...` commands
don't re-prompt.

---

## 5. Configure metafields (Settings → Custom data → Products)

Each metafield needs an exact namespace and key — the theme reads them by name.

**Namespace: `custom`** for every entry below.

| Key | Type | Notes |
|---|---|---|
| `notes_top` | List of single-line text | Top notes (e.g. bergamot, pink pepper) |
| `notes_heart` | List of single-line text | Heart notes |
| `notes_base` | List of single-line text | Base notes |
| `olfactory_family` | Single-line text | Preset values: Floral, Woody, Oriental, Fresh |
| `olfactory_subfamily` | Single-line text | Free text (e.g. "Smoky oriental") |
| `concentration` | Single-line text | Preset: Eau de Parfum, Parfum, Eau de Toilette |
| `perfumer_name` | Single-line text | |
| `perfumer_page` | Page reference | Links to a "the-perfumer" page |
| `year_launched` | Integer | |
| `inspiration` | Rich text | |
| `longevity_hours` | Integer | |
| `sillage` | Single-line text | Preset: Intimate, Moderate, Strong |
| `gender_expression` | Single-line text | Preset: Feminine, Masculine, Unisex |
| `related_products` | List of product references | Used by the "Pairings" section |

**Article metafields** (Settings → Custom data → Articles, namespace `custom`):

| Key | Type |
|---|---|
| `featured_products` | List of product references |

---

## 6. Install the Search & Discovery app

It's free, made by Shopify, and powers collection filters + smarter search.

1. Apps → "Search & Discovery" → install
2. Open it, **Filters** tab → Add filters on the `all` collection (Shopify
   propagates these to all auto-collections):
   - Olfactory family → `custom.olfactory_family`
   - Concentration → `custom.concentration`
   - Notes top / heart / base → `custom.notes_top` etc.
   - Gender expression → `custom.gender_expression`
   - Price (built-in)
   - Availability (built-in, "Hide out of stock")
   - Size (variant option, after you've added products)
3. **Synonyms** tab → add: `oud ↔ agarwood`, `EDP ↔ eau de parfum`

---

## 7. Create collections

Online Store → Collections → **Create collection**.

| Handle | Type | Rule |
|---|---|---|
| `all` | Automatic | (default — all products) |
| `floral` | Automatic | Product metafield `custom.olfactory_family` equals `Floral` |
| `woody` | Automatic | same, `Woody` |
| `oriental` | Automatic | same, `Oriental` |
| `fresh` | Automatic | same, `Fresh` |

The handle is the slug shown in the URL — match these exactly so the
"Family tiles" section can link to them.

---

## 8. Create pages

Online Store → Pages → **Add page**.

| Handle | Template (set in sidebar) | Notes |
|---|---|---|
| `the-house` | `page.story` | Brand story |
| `the-perfumer` | `page.story` | (Or one page per perfumer) |
| `discovery-set` | `page.story` | Sample-set landing |
| `contact` | `page.contact` | Contact form |

---

## 9. Create the journal blog

Online Store → Blog posts → Manage blogs → **Add blog**.

- Handle: **`journal`** (exactly)
- Comments: off (or moderated)
- Default tags for articles: `Notes`, `Rituals`, `People`, `Atelier`

---

## 10. Enable new customer accounts

Settings → Customer accounts → **New customer accounts** (passwordless OTP)
→ enable.

Branding tab: upload your logo, set background and accent to match the
brand tokens (paper `#FAF7F2`, ink `#0E0E0C`, champagne `#C9A96E`).

---

## 11. Push the theme

```powershell
shopify theme push --unpublished
```

This uploads the theme as a *draft* (doesn't replace the live theme).
First push takes ~60 seconds.

In the admin: Online Store → Themes → the new "Maison" theme appears under
**Theme library** → **Actions** → **Publish**.

For day-to-day editing, use `shopify theme dev` (live preview) and
`shopify theme push` to push the latest.

---

## 12. Add at least one product to see it work

Products → Add product.

Fill out: title, description, price, at least one image, one variant
(size). Then scroll to **Metafields** and fill the `custom.*` fields you
defined in step 5. Save.

Visit the storefront — the product page should render with the note
pyramid, longevity/sillage details, and the metafield-driven copy.

---

## 13. Custom domain (optional, after the store has plan)

A live Shopify store needs a paid plan (~$29/mo Basic) to attach a custom
domain. Once on a plan:

- Settings → Domains → Connect existing domain (you own e.g. `maison.com`)
- Or **Buy new domain** through Shopify (auto-configures DNS)

The dev store has no plan, so it stays on `your-shop.myshopify.com`.

---

## Useful CLI cheatsheet

```powershell
shopify theme dev --store <handle>     # local preview, hot reload
shopify theme push                     # update the currently linked theme
shopify theme push --unpublished       # push as a new draft theme
shopify theme pull                     # pull settings_data.json back from store
shopify theme check                    # static lint — run before every commit
shopify theme list --store <handle>    # see all themes on the store
shopify theme open                     # open store admin in browser
```

---

## What's known to be incomplete

These are intentional gaps, listed so you don't think the theme is broken:

- **The 3 woff2 fonts** — see step 3 above. Until added, the site uses
  serif/sans-serif system fallbacks.
- **`config/settings_data.json`** is shipped empty. The merchant will fill
  it on first push via the theme editor.
- **No demo content** — no products, no journal articles. The theme will
  render hero/family-tiles sections with placeholder text once configured
  via the theme editor.
- **Customer account branding** — set in step 10, not in the theme code.
