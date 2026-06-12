# Rehobbie — Hobby Recovery App

## Purpose
Help users rediscover abandoned creative hobbies (Photography, Painting, Drawing, Writing) through a seamless, no-login onboarding flow that leads them back to what they loved — and then hands them a personalised plan to actually start again.

---

## Features
- Mobile-first, hand-drawn aesthetic: lined-paper backgrounds + an animated sketchy page border
- Illustrated onboarding with large tappable cards and cursive heading artwork
- Multi-select hobby picker on a centered, flexible grid (add new hobbies in one file)
- Auto-skip logic — if only 1 hobby is selected, the "pick favourite" step is bypassed
- Swipable yes/no card for the "pick up where you left off?" decision
- Zustand store keeps all state across steps without prop drilling
- **Dashboard (swipe yes):** skill-level selector → AI recovery plan → resource shelf → social proof
- **Explore (swipe no):** other hobbies + brand-new suggestions that restart the flow pre-selected
- Motion (`motion/react`) floating animations on home and spring transitions on every step

---

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack), TypeScript
- **Styling:** Tailwind CSS v3 (`tailwind.config.ts` + `postcss.config.js`)
- **Animation:** Motion (`motion/react`)
- **State:** Zustand
- **Fonts:** Caveat (sketch feel) + Nunito, via `next/font/google`
- **AI:** Microsoft Foundry IQ — server route `app/api/recovery-plan/route.ts`, with a local generator fallback in `lib/foundry.ts`
- **Analytics:** PostHog (`lib/posthog.ts`)
- **Persistence:** Supabase anonymous sessions (`lib/supabase.ts`)

> Every integration is **optional and env-gated**: with its keys missing it cleanly
> no-ops (sessions skip, analytics skip, the AI plan uses the local generator), so
> the app always runs. See [Environment & Integrations](#environment--integrations).

---

## File Structure

```
app/
  page.tsx                   ← Home — floating illustrations, logo, get-started CTA
  layout.tsx                 ← Root layout with font setup
  global.css                 ← Tailwind layers, lined-paper + sketch-border styles
  onboarding/page.tsx        ← Step 1: hobby picker (multi-select grid)
  select-favorite/page.tsx   ← Step 2: pick favourite (auto-skipped if 1 hobby)
  why-stopped/page.tsx       ← Step 3: stop reasons (multi-select chips)
  ready-check/page.tsx       ← Step 4: swipable yes/no card
  dashboard/page.tsx         ← Phase 2: swipe yes → skill, AI plan, resources
  explore/page.tsx           ← Phase 2: swipe no → other / new hobbies

app/api/
  recovery-plan/route.ts     ← Server route → Microsoft Foundry IQ (key stays server-side)

components/
  SketchBorder.tsx           ← Animated hand-drawn page border (SVG)
  PageFrame.tsx              ← Scrollable Phase-2 page shell (border + lined paper)
  AnalyticsProvider.tsx      ← Boots PostHog + anon Supabase session, tracks pageviews
  onboarding/
    OnboardingShell.tsx      ← Centered shell for the 4 onboarding steps
    HobbyCard.tsx            ← Illustrated hobby tile with selected state
    ReasonChip.tsx           ← Pill button for stop reasons
    SwipeCard.tsx            ← Drag-physics yes/no swipe card
  dashboard/
    SkillSelector.tsx        ← Horizontal scrollable skill-level pills
    RecoveryPlanCard.tsx     ← AI plan with loading + reveal states
    ResourceShelf.tsx        ← Books / YouTube / community columns
    OthersLikeYou.tsx        ← Social-proof strip

lib/
  hobbies.ts                 ← Hobbies, stop reasons, skill levels, "new" hobbies
  resources.ts               ← Resource cards keyed by hobby id (+ generic fallback)
  foundry.ts                 ← Calls the Foundry route; local fallback generator
  supabase.ts                ← Anonymous session client + saveSession (env-gated)
  posthog.ts                 ← Analytics init + capture helpers (env-gated)

store/
  onboarding.ts              ← Zustand store (selections, favourite, reasons, skill)

types/
  index.ts                   ← Hobby, StopReason, SkillLevel, Resource, RecoveryPlan, …

copilot-instruct.md          ← Original handoff notes (Supabase/PostHog/Foundry ideas)
```

---

## Quick Start

```bash
npm install
cp .env.local.example .env.local   # optional — fill in keys to enable integrations
npm run dev
```

Open http://localhost:3000 — click "Get started" to enter the onboarding flow.

All runtime dependencies (Motion, Zustand, Tailwind v3, Supabase, PostHog, etc.) are
already declared in `package.json`, so a single `npm install` is enough. The app runs
with **no configuration** — all integrations are optional (see below).

### Styling requirements
- **Tailwind v3** is pinned, with a `postcss.config.js` that loads `tailwindcss` +
  `autoprefixer`. Without that PostCSS config, no utility classes are generated.
- The `@/*` path alias is set in `tsconfig.json` (`baseUrl: "."`, `paths: { "@/*": ["./*"] }`).

### Images
Illustrations live in `/public/images/`. Hobby tiles use the `*_select.png` files
referenced in `lib/hobbies.ts`; the home page uses the plain illustrations and the
cursive heading artwork (`rehobbie_logo.png`, `used_to_like_heading.png`,
`why_stopped.png`, `get_started_button.png`).

---

## Flow

```
/ (Home)
  ↓ Get started
/onboarding          — pick hobbies (1 or more)
  ↓ if 2+ selected
/select-favorite     — pick the one you loved most
  ↓ (skipped if only 1 hobby picked)
/why-stopped         — pick reasons for stopping
  ↓
/ready-check         — swipe right = yes, left = no
  ↓ yes                         ↓ no
/dashboard                    /explore
- skill level selector        - hobbies you didn't pick
- AI recovery plan (Foundry)  - "something completely new?"
- resource shelf              - tapping a card restarts the
- "others like you"             flow with that hobby pre-selected
```

---

## Adding New Hobbies

Edit `lib/hobbies.ts` — the onboarding grid adapts automatically:

```ts
export const HOBBIES: Hobby[] = [
  { id: "photography", label: "Photography", image: "/images/camera_select.png" },
  // add new entry here ↓
  { id: "gardening", label: "Gardening", image: "/images/gardening_select.png" },
];
```

Optionally add matching entries to `lib/resources.ts` (books / videos / communities).
If a hobby has no curated resources, `getResources` falls back to a generic set, so
nothing breaks.

---

## Environment & Integrations

Copy `.env.local.example` → `.env.local` and fill in whichever keys you have. Each
block is independent and optional.

### Supabase — anonymous sessions (Step 6)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- On first load, `AnalyticsProvider` calls `ensureAnonSession()` (no sign-up). When the
  user makes their swipe decision, `ready-check` fires `saveSession()` to write the
  completed journey to a `sessions` table. The SQL for that table is in `lib/supabase.ts`.
- Enable **Anonymous sign-ins** in Supabase → Authentication.

### PostHog — analytics (Step 7)
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- `AnalyticsProvider` initialises PostHog and captures pageviews on every route change.
- Per-step events: `onboarding_hobby_selected`, `onboarding_favourite_set`,
  `onboarding_reason_selected`, `onboarding_swipe_decision`, `dashboard_skill_selected`.

### Microsoft Foundry IQ — AI recovery plan (Step 9)
- `AZURE_FOUNDRY_ENDPOINT`, `AZURE_FOUNDRY_API_KEY`, `AZURE_FOUNDRY_DEPLOYMENT`,
  `AZURE_FOUNDRY_API_VERSION` (server-side only — the key never reaches the browser).
- The dashboard calls `generateRecoveryPlan()` (`lib/foundry.ts`), which POSTs to the
  server route `app/api/recovery-plan/route.ts`. That route asks Foundry (Azure
  OpenAI–compatible chat completions) for a strict-JSON `RecoveryPlan`, validates the
  shape, and returns it.
- **Fallback:** if Foundry is unconfigured (route returns `501`), errors, or returns an
  unexpected shape, the client falls back to a deterministic local generator tailored to
  the chosen skill level and stop reasons — so a plan always renders.

---

## Notes
- No user accounts required — the flow is designed to respect the "users abandon things
  easily" principle, so it never blocks on sign-up.
- The Zustand store is in-memory only; a full browser reload resets onboarding state.
- The `SwipeCard` outer `<motion.div>` owns the drag physics — keep it when swapping in
  custom artwork.
