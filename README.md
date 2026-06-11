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
- **AI:** Microsoft Foundry IQ — recovery plan generator in `lib/foundry.ts` (currently a local generator behind a Foundry-ready seam)

> Note: `posthog-js` is installed but not yet wired. Supabase is referenced in the handoff notes but not installed/used yet.

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

components/
  SketchBorder.tsx           ← Animated hand-drawn page border (SVG)
  PageFrame.tsx              ← Scrollable Phase-2 page shell (border + lined paper)
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
  foundry.ts                 ← AI recovery plan generator (Foundry integration seam)

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
npm run dev
```

Open http://localhost:3000 — click "Get started" to enter the onboarding flow.

All runtime dependencies (Motion, Zustand, Tailwind v3, etc.) are already declared in
`package.json`, so a single `npm install` is enough.

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

## AI Recovery Plan (Foundry)

`lib/foundry.ts` exposes:

```ts
generateRecoveryPlan({ hobby, skillLevel, stopReasons }): Promise<RecoveryPlan>
```

It currently returns a structured, deterministic plan generated locally (tailored to
the chosen skill level and the reasons the user stopped), with a simulated delay so the
dashboard can show a "generating" state. To go live, replace the body of
`generateRecoveryPlan` with a Foundry call that returns the same `RecoveryPlan` shape —
the rest of the dashboard needs no changes.

---

## Phase 2 — Remaining Integrations

The dashboard and explore UIs are built. Still open (see `copilot-instruct.md`):
- Wire the real Microsoft Foundry IQ call in `lib/foundry.ts`
- PostHog event tracking per step (`posthog-js` is installed)
- Supabase anonymous sessions to persist journeys (no login required)

---

## Notes
- No user accounts required — the flow is designed to respect the "users abandon things
  easily" principle, so it never blocks on sign-up.
- The Zustand store is in-memory only; a full browser reload resets onboarding state.
- The `SwipeCard` outer `<motion.div>` owns the drag physics — keep it when swapping in
  custom artwork.
