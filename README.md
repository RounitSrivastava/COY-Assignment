# Coy — Discover Tab (Assignment Part B)

A swipe-based discovery tab built for Coy's mobile-first web experience.

## What's Built
- **Swipe gestures**: Card stack with drag left (pass) and drag right (like) powered by Framer Motion, with responsive rotation, spring physics, and dynamic stamps (`LIKE` / `PASS`).
- **Desktop support**: On desktop, users can use the Pass (✕) / Like (♥) buttons or keyboard shortcuts (`←` / `→` arrow keys).
- **Privacy first**: The feed endpoint (`GET /feed`) never leaks whether a profile has liked the current user. A match is only created and revealed on the backend when both users like each other.
- **32 seeded profiles**: Mock profiles with photos, college/city, bios, and interests. Several profiles have pre-seeded "likes" so matches happen during the demo.
- **Persistence**: Swipes and matches are stored in `data/db.json` via atomic writes, so swiped profiles never reappear even after page reloads.
- **"It's a match!" screen**: Confetti burst, matched user details, and a quick-action button to chat.
- **Matches view**: Lists all mutual matches with an interactive mock chat to test messaging.
- **Empty state & reset**: Shows a clean empty state when out of profiles, with a "Reset Feed" button in the navbar and on the empty screen to replay the flow.

## Tech Stack
- **Next.js 14** (App Router & Route Handlers)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (drag gestures & card animations)
- **canvas-confetti** (match celebration)

## Setup & Running Locally

1. Install dependencies:
```bash
npm install
```

2. Run the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For the best experience, toggle device emulation in Chrome DevTools (`Cmd+Shift+M` or `Ctrl+Shift+M`) to see the mobile view.

3. To create a production build:
```bash
npm run build
npm start
```

## API Endpoints

- `GET /feed` — returns unswiped profiles (sanitized without `hasLikedCurrentUser`).
- `POST /swipe` — accepts `{ profileId: string, action: 'like' | 'pass' }`. Returns `{ success: true, isMatch: boolean, match?: ... }`.
- `GET /matches` — returns all mutual matches for the user.
- `POST /api/reset` — helper endpoint that clears swipes/matches and resets back to 32 profiles for demo purposes.

*(Note: route rewrites in `next.config.mjs` ensure both `/feed` and `/api/feed` work identically).*

## Code Structure

- `app/`
  - `page.tsx`: Shell with tab switcher (Home, Discover, Matches) and top navbar.
  - `feed/route.ts`, `swipe/route.ts`, `matches/route.ts`: API route handlers matching assignment requirements.
- `components/`
  - `DiscoverTab.tsx`: Card stack orchestration, keyboard listeners, and action buttons.
  - `SwipeCard.tsx`: Draggable card component with spring release and stamp overlays.
  - `MatchModal.tsx`: Celebration popup when a mutual match occurs.
  - `MatchesTab.tsx`: Mutual matches list with interactive chat preview.
  - `EmptyState.tsx`: Out-of-profiles screen.
  - `Navbar.tsx` & `TabBar.tsx`: Mobile header and bottom navigation.
- `lib/`
  - `db.ts`: File-backed storage logic and privacy sanitizer (`toPublicProfile`).
  - `seedData.ts`: 32 diverse profile objects.
