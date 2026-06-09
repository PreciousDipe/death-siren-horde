# DEATHSIRENS — Esports Org Website

A 3-page dark-themed site for a Nigerian Mobile Legends team, built on the existing TanStack Start + Tailwind v4 stack. Pure frontend (no backend) using placeholder content for players, news, tournaments.

## Pages & Routes

```
src/routes/
  index.tsx          → Homepage
  roster.tsx         → Team Roster
  tournaments.tsx    → Tournaments
  achievements.tsx   → Stub (linked in nav, simple placeholder)
  media.tsx          → Stub
  news.tsx           → Stub
  contact.tsx        → Stub
```

Achievements/Media/News/Contact get minimal styled placeholder pages so navbar links work without 404s. Main build effort is Home, Roster, Tournaments per spec.

## Design System (src/styles.css)

Override `:root` tokens with the exact palette:
- `--background: #080808`, `--card: #181818`, `--secondary: #121212`
- `--primary: #00B8FF` (cyan blue), `--accent: #8B3DFF` (purple)
- `--foreground: #FFFFFF`, `--muted-foreground: #A0A0A0`
- Custom tokens: `--win: #00FF88`, `--lose: #FF3B3B`, `--verified: #00B8FF`
- Gradient token: `--gradient-brand: linear-gradient(90deg, #00B8FF, #8B3DFF)`
- Glow shadows: `--shadow-glow-blue`, `--shadow-glow-purple`

Fonts loaded via `<link>` in `__root.tsx`:
- Headings: **Orbitron** (bold, uppercase, gaming feel)
- Body: **Rajdhani** (clean sans-serif, esports-typical)
- Tagline italic: Rajdhani italic bold

## Shared Components

```
src/components/
  layout/
    Navbar.tsx          → sticky, mobile hamburger w/ animation
    Footer.tsx          → gradient top border, social icons
    SiteShell.tsx       → wraps pages with Navbar + Footer
  home/
    Hero.tsx            → particle/galaxy bg (CSS + animated dots), watermark sides
    StatsBar.tsx        → 4-stat row, 2x2 on mobile
    AboutSection.tsx
    RosterPreview.tsx   → 5 horizontal cards, scroll on mobile
    BottomGrid.tsx      → 4-col: News, Media, MVP, Community
    WhyJoin.tsx         → 5 icon columns
    CtaTrio.tsx         → Recruitment / Tournament / Newsletter
  roster/
    PlayerCard.tsx      → role badge, photo, name, verified
    RosterFilter.tsx    → tabs with active state
  tournaments/
    CountdownCard.tsx   → live countdown w/ useEffect interval
    ScheduleTable.tsx
    StandingsTable.tsx
  ui/                   → existing shadcn
```

## Data (static, in-file)

```
src/data/
  players.ts      → 7 players (name, realName, role, photo, verified)
  news.ts         → 3 news items
  tournaments.ts  → upcoming + schedule + standings
```

Roles: GOLD LANE, MID LANE, EXP LANE, ROAMER, JUNGLE (each gets its own badge color).

## Assets

Generate via `imagegen` (premium quality for logo, fast for the rest):
- `src/assets/logo.png` — DEATHSIRENS skull/siren mark, transparent bg
- `src/assets/hero-bg.jpg` — dark purple/blue galaxy/particles backdrop
- 7 player portraits — stylized esports-style headshots in team jerseys
- 3 news thumbnails, 4 gallery images, 1 MVP spotlight photo
- ~4 small opponent team logos for schedule/standings

## Interactive Features

- **Countdown**: `useEffect` + `setInterval`, target date ~14 days out, 4 boxes (D:H:M:S)
- **Filter tabs**: `useState<Role|'ALL'>`, filters player grid
- **Mobile menu**: `useState` + animated slide-down with framer-motion (already common)
- **Hover glow**: Tailwind `hover:shadow-[0_0_24px_#00B8FF55]` on cards
- **Sticky nav**: `sticky top-0 z-50`
- **Smooth scroll**: `scroll-behavior: smooth` on html
- **Newsletter**: controlled input + toast on submit (no backend)
- **Page transitions**: simple fade via framer-motion on route component

## Per-page SEO (head())

Each route sets its own title, description, og:title, og:description. Home gets og:image of logo.

## Mobile

- Hamburger < md
- Stats grid: `grid-cols-2 md:grid-cols-4`
- Roster preview: `overflow-x-auto` horizontal scroll on mobile
- Bottom 4-col grid stacks to single column
- All buttons min-h-11 (44px)

## Out of Scope

- No backend / Lovable Cloud (purely presentational; newsletter is UI-only)
- No real auth or "Join the Squad" form processing (button → /contact stub)
- Achievements/Media/News/Contact are styled placeholders, not fully fleshed
