# Coy — Discover Tab 💖

A mobile-first, swipe-based discovery experience built for **Coy** with mutual privacy guarantees, smooth drag gesture physics, and persistent state across page reloads.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 📱 Features

### 1. Profile Data (32 Seeded Profiles)
- **32 realistic, diverse profiles** featuring names, ages (20–26), high-resolution portrait photos, engaging bios, colleges/cities (e.g. *IIT Bombay, CEPT University, BITS Pilani, NID Ahmedabad, Ashoka University*), and interest tags.
- **Pre-seeded mutual likers**: Several profiles have secretly already liked the logged-in user so you can experience real matches during demos.
- **Strict Privacy Guarantee**: The backend never leaks whether another user has liked you in `/feed`. Coy's core promise is that nobody knows unless it's mutual.

### 2. Swipe Experience & Gestures
- **Card Stack UI**: Physical card stack with depth scaling and layering.
- **Drag Gestures**: Fluid mobile and touch dragging with responsive rotation, spring bounce, and velocity-based releases.
- **Dynamic Stamps**: Visual badges (`LIKE` in emerald green, `PASS` in crimson red) that fade in proportionately to drag distance.
- **Desktop Controls**: Dedicated Pass (✕) and Like (♥) buttons, plus **Keyboard Navigation** (`← Arrow` to Pass, `→ Arrow` to Like).
- **No Repeat Swipes**: Once swiped, a profile is permanently saved and will never reappear in the feed.
- **Empty State**: Animated radar pulse screen when all profiles have been swiped, with an instant "Reset Demo" button.

### 3. Mutual Matching
- **"It's a Match!" Modal**: Triggers exclusively when both users like each other. Displays celebratory confetti bursts (`canvas-confetti`), dual avatar rings, bio preview, and action buttons.
- **Matches Tab**: Dedicated view listing all mutual matches with photo cards, timestamp, and a tap-to-chat interface with instant reply simulations.

### 4. Backend APIs & Persistence
- `GET /feed` (and `/api/feed`): Returns all profiles the user has not yet swiped on (sanitized without `hasLikedCurrentUser`).
- `POST /swipe` (and `/api/swipe`): Records a `'like'` or `'pass'` action and returns whether it created a mutual match.
- `GET /matches` (and `/api/matches`): Returns the user's mutual matches.
- `POST /api/reset`: Resets demo database back to 32 fresh profiles.
- **Persistence**: All swipes and matches are saved to disk (`data/db.json`) and persist across page reloads and server restarts.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router & Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations & Gestures**: [Framer Motion](https://www.framer.com/motion/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: Atomic JSON file store (`data/db.json`) for zero-config persistence on any platform.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (preferably in mobile view or responsive mode).

### 3. Or Build & Run Production Server
```bash
npm run build
npm start
```

---

## 🧪 Testing the APIs

You can test the APIs directly using cURL or any HTTP client:

### Get Feed:
```bash
curl http://localhost:3000/feed
```

### Record a Swipe (Pass):
```bash
curl -X POST http://localhost:3000/swipe \
  -H "Content-Type: application/json" \
  -d '{"profileId": "prof_01", "action": "pass"}'
```

### Record a Swipe (Like - triggers match on pre-seeded liker prof_02):
```bash
curl -X POST http://localhost:3000/swipe \
  -H "Content-Type: application/json" \
  -d '{"profileId": "prof_02", "action": "like"}'
```

### Get Mutual Matches:
```bash
curl http://localhost:3000/matches
```

### Reset Demo:
```bash
curl -X POST http://localhost:3000/api/reset
```

---

## 📂 Project Structure

```text
├── app/
│   ├── api/
│   │   ├── feed/route.ts      # GET /api/feed
│   │   ├── swipe/route.ts     # POST /api/swipe
│   │   ├── matches/route.ts   # GET /api/matches
│   │   └── reset/route.ts     # POST /api/reset
│   ├── feed/route.ts          # Direct GET /feed
│   ├── swipe/route.ts         # Direct POST /swipe
│   ├── matches/route.ts       # Direct GET /matches
│   ├── globals.css            # Custom styles & Coy themes
│   ├── layout.tsx             # Root layout & metadata
│   └── page.tsx               # Main mobile container & tabs
├── components/
│   ├── DiscoverTab.tsx        # Core swipe stack & desktop controls
│   ├── SwipeCard.tsx          # Card drag physics, stamps, & bio details
│   ├── MatchModal.tsx         # "It's a Match!" screen & confetti
│   ├── MatchesTab.tsx         # Mutual matches grid & chat simulator
│   ├── EmptyState.tsx         # Radar pulse when out of profiles
│   ├── HomeTab.tsx            # Clean placeholder Home tab
│   ├── Navbar.tsx             # Coy header, match counter, & reset button
│   └── TabBar.tsx             # Bottom mobile tab navigation
├── lib/
│   ├── db.ts                  # Persistent storage & privacy sanitation
│   └── seedData.ts            # 32 high quality mock profiles
├── types/
│   └── index.ts               # TypeScript interfaces & types
└── data/
    └── db.json                # JSON database store
```

---

## 🔒 Privacy Architecture Note

In dating apps, leaks often happen when client-side state includes flags like `hasLikedYou` or `isMatchCandidate`. In this application:
1. The `hasLikedCurrentUser` field is exclusively stored on the server.
2. The `getFeedProfiles()` function strictly strips out `hasLikedCurrentUser` before returning JSON to the client.
3. Matches are calculated server-side only when a mutual `like` action is submitted.
