# Velquarath Cafe — Cloudflare Build & Multi-Page Deployment Fix

Resolve the Cloudflare build and runtime warnings so that all interactive JavaScript features, dynamic menu/gallery images, and multi-page HTML routes work reliably in production.

## User Review & Critical Decisions

> [!IMPORTANT]
> Your Cloudflare deployment succeeded in uploading the 11 HTML pages and 5 static images, but **skipped bundling `js/script.js`** because the HTML `<script>` tags lacked `type="module"`. As a result, interactive features (mobile menu drawer, live menu search and category tabs, photo gallery lightbox, reservation/contact form validators, and cookie preferences) and dynamically rendered menu/gallery images were excluded from the deployed `dist/` bundle.

- **Confirmed Decision 1 — Bundle `js/script.js` into `dist/` and Fix Warnings**: We will add `type="module"` to `<script src="js/script.js"></script>` across all 11 HTML pages, resolve image URLs inside `js/script.js` using `new URL(..., import.meta.url).href` so Vite hashes and bundles all dynamic menu/gallery images, and replace `__dirname` with `import.meta.dirname` in `vite.config.ts`.
- **Confirmed Decision 2 — Configure `wrangler.jsonc` for Multi-Page HTML Routing**: We will add a committed `wrangler.jsonc` configured to serve the `./dist` directory with `html_handling: "auto-trailing-slash"`, `not_found_handling: "404-page"`, `workers_dev: true`, and `preview_urls: true` so Cloudflare serves all 11 HTML pages natively without auto-generating single-page-application overrides or emitting configuration warnings.

---

## 1. Overview & Core Concept

- **What It Does**: Ensures the multi-page Velquarath Cafe website builds cleanly with zero Vite or Cloudflare Wrangler warnings and ships a complete `dist/` folder containing all 11 HTML pages, CSS, bundled JavaScript, and high-resolution food photography.
- **Target Audience / Persona**: Restaurant guests browsing the menu, filtering dishes, viewing the gallery, and preparing table reservation requests on desktop and mobile devices.
- **Key Value**: Eliminates broken interactivity on Cloudflare by ensuring `js/script.js` is bundled into `dist/assets/` and all dynamic image references resolve to their hashed production asset URLs.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Mobile Navigation Drawer**: Tapping the hamburger button locks background page scrolling and opens the independent scrollable drawer (`overscroll-contain`) with links to all pages and policies.
  2. **Live Menu Search & Recommendations**: Clicking or typing in the search bar on the Menu page immediately opens the Chef & Bar Recommendations popover, filters across all 45+ dishes and drinks, and renders each dish card with its bundled food photograph.
  3. **Interactive Photo Gallery & Lightbox**: Filtering gallery categories (`All`, `Off the Grill`, `Traditional Mains`, `Brunch & Burgers`, `Interior & Vibe`) and clicking any photo opens the keyboard-navigable lightbox modal.
  4. **Reservations, Contact & Cookie Preferences**: Submitting the Reservation or Contact form validates inputs and generates a ready-to-copy summary; clicking "Manage Cookie Preferences" opens the granular consent modal.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Warm Savanna Hearth & Contemporary African Luxury.
  - *Color Palette & Mood*: Deep charcoal canvas (`#141210`), warm espresso card surfaces (`#1E1B17`), warm cream typography (`#F4ECDA`), muted sand secondary copy (`#B8AD96`), and burnished gold accents (`#C9A24B`).
  - *Typography & Hierarchy*: `Fraunces` serif display headings paired with `Plus Jakarta Sans` body copy and `JetBrains Mono` tabular pricing.
  - *Component Styling & Layout*: Responsive 12-column container layout, uniform 4:3 food card photography, and clean typographic metadata.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Module Script Bundling & Dynamic Asset Resolution**
  - *Chosen Approach*: Add `type="module"` to `<script type="module" src="js/script.js"></script>` in all 11 HTML pages and use `new URL('../assets/images/...', import.meta.url).href` in `js/script.js`.
  - *Why*: Vite only bundles scripts marked with `type="module"`. Furthermore, because Vite hashes image filenames in `dist/assets/` (e.g., `dish_sticky_ribs-CjBxYV1k.jpg`), using `new URL(..., import.meta.url).href` guarantees that dynamically rendered cards on `menu.html` and `gallery.html` point to the exact hashed image files in production.
  - *Alternatives Considered*: Copying `js/` and `assets/` verbatim via `publicDir` was passed over because bundling optimizes and caches assets with content hashes.
- **Decision 2: Committed `wrangler.jsonc` & Lockfile**
  - *Chosen Approach*: Commit an explicit `wrangler.jsonc` at the repository root and ensure `package-lock.json` is present.
  - *Why*: Without `wrangler.jsonc`, `npx wrangler deploy` enters an auto-setup fallback that modifies `.gitignore`, re-runs the build twice, sets `not_found_handling: "single-page-application"`, and warns about missing `workers_dev` and `preview_urls`. Committing `wrangler.jsonc` and `package-lock.json` makes Cloudflare builds fast, deterministic, and warning-free.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Build Pipeline Diagram**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Cloudflare Build & Deploy Pipeline                   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  1. Vite Multi-Page Build (`vite.config.ts` using `import.meta.dirname`)│
│  ├─ 11 HTML Entry Points (`index.html`, `menu.html`, `story.html`, ...) │
│  ├─ CSS Stylesheet (`css/style.css` ──► `dist/assets/style-[hash].css`) │
│  ├─ ES Module Script (`<script type="module" src="js/script.js">`)      │
│  │   └──► Bundled to `dist/assets/script-[hash].js`                     │
│  └─ Food & Interior Photography (`new URL(..., import.meta.url).href`)  │
│      └──► Bundled & Hashed in `dist/assets/*.jpg`                       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. Cloudflare Wrangler Asset Deployment (`wrangler.jsonc`)             │
│  ├─ `assets.directory`: `"./dist"`                                      │
│  ├─ `assets.html_handling`: `"auto-trailing-slash"`                     │
│  ├─ `assets.not_found_handling`: `"404-page"`                           │
│  └─ `workers_dev: true` & `preview_urls: true` (zero deploy warnings)   │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - `MENU_CATEGORIES` & `MENU_ITEMS`: 45+ dishes and drinks across 8 categories stored in `js/script.js`, referencing Vite-resolved image URLs.
  - `GALLERY_ITEMS`: 5 curated high-resolution photography items with category metadata and lightbox captions.
  - `localStorage` (`afrotopia_cookie_consent_v1`): Persists user cookie consent state across all 11 pages.
- **Interactive Component & State Mapping**:
  - **Vite Config Modernization**: Replace `__dirname` with `import.meta.dirname` in `vite.config.ts` to eliminate the Vite 8 `configLoader: 'native'` warning.
  - **HTML Entry Points**: Update `<script src="js/script.js"></script>` to `<script type="module" src="js/script.js"></script>` across all 11 HTML files so Vite bundles the script and rewrites the tag to the hashed output bundle.
  - **Dynamic Image Resolution**: Update `IMAGES` in `js/script.js` to use `new URL('../assets/images/<file>.jpg', import.meta.url).href` so both `menu.html` and `gallery.html` display all dish and patio photos in production.
  - **Cloudflare Configuration**: Create `wrangler.jsonc` with explicit static asset serving settings and generate `package-lock.json` so Cloudflare caches dependencies cleanly.
