# The Blue Experience — London Is Blue

An immersive, Chelsea FC–inspired digital club experience: a scroll-driven cinematic hero, a 3D Stamford Bridge you can explore, a verified trophy room and legends archive, a season tracker, and a complete **demo** booking system for stadium tours and matchday seats.

> **Unofficial portfolio project.** Inspired by Chelsea FC, but not affiliated with, endorsed by or operated by Chelsea Football Club. Bookings are simulated, no payments are taken, and no real tickets or reservations are created.

## Highlights

| Area | What it does |
|---|---|
| **Cinematic hero** | A 460vh scroll-scrubbed sequence: aerial London → over the Shed End → pitchside, with the chapters *London Is Blue → 1905 → 40,044 voices → More than a club*. It uses a live Three.js fly-through by default and switches automatically to an image sequence if you add frames (see below). |
| **Digital Stamford Bridge** | An orbitable procedural 3D stadium with 11 numbered hotspots, smooth camera flights and keyboard navigation. A photo tour uses real CC-licensed images (tunnel, museum, Shed End…), with a full-screen drag-to-explore viewer. The crowd ambience is synthesised and off by default. |
| **Booking system** | Tours & museum: experience → date → time → tickets → details → review. Features a calendar with closed matchdays, slot capacity, quantity rules and validation. Matchdays: an interactive stand plan, a per-seat grid (keyboard accessible, max 4 seats), price bands and a summary. A confirmation page shows a demo reference and a decorative “Not a ticket” code, and can be printed. |
| **Demo account** | Lists bookings, with cancellation (confirm step) for future bookings. Also holds favourite players, legends and moments, plus profile preferences. |
| **Matches** | Fixtures and results with search, competition, home/away and month filters. Each match has a detail page with scorers, attendance, referee and a source list. Also includes a league table excerpt, form and top scorers. |
| **Heritage** | Interactive era timeline (1905 → 2026), a trophy room filterable by competition and era with final-by-final detail, and legends profiles with stories, moments and trophy links. |
| **Also** | Squad with position filters, a transfers board (completed deals only), Chelsea Women honours, a newsroom with source attribution, and a Fan Zone (kit history, glossary, gallery, quiz). Site-wide search opens with ⌘/Ctrl + K. |

## Tech stack

React 18 · TypeScript (strict) · Vite 6 · Tailwind CSS 3 · Framer Motion · Three.js + React Three Fiber + drei · React Router 6 · Lucide icons.

## Architecture

```
src/
  data/        Typed, sourced content: season snapshot, squad, honours, legends, timeline, news,
               stadium tour stops, demo booking products, media manifest (with licences)
  services/    provider.ts  – FootballDataProvider interface (snapshot today, live API later)
               bookings.ts  – demo booking store, simulated availability, pricing
               profile.ts   – demo profile & favourites (localStorage)
  lib/         hooks (data, meta tags, reduced motion), formatting helpers
  components/  design-system primitives (Button, Img, Reveal, ProvenanceTag…), layout, search
  features/    home · matches · squad · heritage · news · stadium · booking · account · fan · about
```

- **Provenance everywhere.** Data is labelled *Verified*, *Snapshot*, *Demo data* or *Editorial* in the UI. Fixtures distinguish scheduled, completed, postponed and *result pending* (past kick-off with no verified score — a score is never invented).
- **Provider abstraction.** The UI only calls `dataProvider`. To go live, implement `FootballDataProvider` against a server-side proxy that holds the API key. Never ship a key in a `VITE_` variable.
- **Media manifest.** Components request images by id. Each asset records author, licence and source. With `VITE_PUBLIC_SAFE=true` (the default), any asset marked `Restricted` is dropped automatically, which keeps a public deployment licence-clean.
- **Performance.** Routes are lazy-loaded. Three.js loads only for the hero fly-through and the stadium page, and the hero stops rendering off-screen. Images are WebP and lazy-loaded.
- **Accessibility.** The site has a skip link, visible focus, labelled forms with inline errors and `aria-live` updates. Dialogs close on Escape. The seat map and calendar are keyboard operable. `prefers-reduced-motion` gives a static hero and disables motion.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
npm run lint
```

Copy `.env.example` to `.env` to change settings:

| Variable | Default | Purpose |
|---|---|---|
| `VITE_DATA_PROVIDER` | `snapshot` | Data source. Only the verified snapshot ships today. |
| `VITE_PUBLIC_SAFE` | `true` | Drop media marked `Restricted` (use `false` only for private builds). |
| `VITE_SITE_URL` | — | Absolute URL for canonical / Open Graph tags. |

Set `BASE=/repo-name/` when building for a GitHub Pages sub-path.

### Swapping the hero to a video-based image sequence

1. Create a stadium fly-through video (for example with an AI video tool). It should be roughly 5–8 s long, with smooth camera motion and no cuts.
2. Run `npm run frames -- path/to/video.mp4` (needs `ffmpeg`). Options: `--frames 180 --width 1920 --quality 72`.
3. Reload the homepage. The hero detects `public/frames/manifest.json` and scrubs the frames on scroll. Delete `public/frames/` to return to the 3D fly-through.

## Data sources & accuracy

- History, honours, legends: chelseafc.com/history and the trophy cabinet, UEFA.com, FIFA.com, and Wikipedia (cross-checked).
- 2026/27 season: a snapshot dated **28 October 2026** from the Wikipedia season article, chelseafc.com fixtures and NBC Sports standings. Only verified rows are shown. For example, the league table is an excerpt, and one disputed goal is shown as unattributed.
- News: original summaries with source, date and link. Official announcements are distinguished from third-party reporting.
- Photos: Wikimedia Commons under CC licences — see [CREDITS.md](CREDITS.md).

## Demo limitations

- No backend: bookings and profile live in the browser’s `localStorage`, so they don’t sync across devices.
- Tour prices, time slots, seat availability and matchday prices are simulated. They are not official prices or availability.
- Season data is a static snapshot, not a live score feed.
- The 3D stadium is a stylised illustration and is not to scale. Tour stops without a licensed photo are labelled *Illustrative*.
- `index.html` sets `noindex` while the project is shared privately. Remove it for a public deployment.

## Deployment

The build output is a static SPA (`dist/`), so it can be hosted on any static host. Configure an SPA fallback to `index.html`:

- **Vercel / Netlify:** framework preset “Vite”. Add a rewrite of `/*` to `/index.html`.
- **Cloudflare Pages:** build command `npm run build`, output `dist`. Cloudflare Access can restrict viewing to invited emails.
- **GitHub Pages:** `BASE=/<repo>/ npm run build`, then publish `dist/` and copy `index.html` to `404.html`.
