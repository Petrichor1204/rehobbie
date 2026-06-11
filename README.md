# Rehobbie — Hobby Recovery App

## Purpose
Help users rediscover abandoned creative hobbies (Writing, Drawing, Painting, Photography) through a seamless, no-login onboarding flow that leads them back to what they loved.

---

## Features
- Mobile-first onboarding with large illustrated tappable cards
- Multi-select hobby picker with a flexible grid (add new hobbies in one file)
- Auto-skip logic — if only 1 hobby selected, the "pick favourite" step is bypassed
- Swipable yes/no card for "pick up where you left off?" decision
- Zustand store keeps all state across steps without prop drilling
- Lined-paper aesthetic with Caveat (sketch) + Nunito fonts
- Framer Motion / Motion floating animations on home, spring transitions on all steps
- Placeholder pages for dashboard (yes path) and explore (no path) — Phase 2

---

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Motion (`motion/react`), lucide-react
- **State:** Zustand
- **Fonts:** Caveat (sketch feel) + Nunito via next/font/google
- **Analytics:** PostHog (placeholder in `lib/posthog.ts`)
- **AI:** Microsoft Foundry IQ (placeholder in `lib/foundry.ts`)
- **Backend:** Next.js API routes
- **Database:** Supabase (placeholder in `lib/supabase.ts`)

---

## File Structure

```
app/
  page.tsx                   ← Home — floating hobby icons, get started CTA
  layout.tsx                 ← Root layout with font setup
  globals.css
  onboarding/page.tsx        ← Step 1: hobby picker (multi-select grid)
  select-favorite/page.tsx   ← Step 2: pick favourite (skipped if 1 hobby selected)
  why-stopped/page.tsx       ← Step 3: stop reasons (multi-select chips)
  ready-check/page.tsx       ← Step 4: swipable yes/no card
  dashboard/page.tsx         ← Phase 2 placeholder (swipe yes → here)
  explore/page.tsx           ← Phase 2 placeholder (swipe no → here)
  api/generate-plan/
    route.ts                 ← AI plan endpoint (placeholder)

components/
  onboarding/
    HobbyCard.tsx            ← Illustrated hobby tile with selected state
    ReasonChip.tsx           ← Full-width pill button for stop reasons
    SwipeCard.tsx            ← Drag-physics yes/no swipe card

lib/
  hobbies.ts                 ← All hobby + stop reason data (single source of truth)
  supabase.ts                ← Supabase client (TODO: wire up)
  posthog.ts                 ← PostHog init (placeholder)
  foundry.ts                 ← Microsoft Foundry IQ (placeholder)
  prompts.ts                 ← AI prompt templates

store/
  onboarding.ts              ← Zustand store (selectedHobbies, favourite, reasons, etc.)

types/
  index.ts                   ← Hobby, StopReason, SkillLevel, OnboardingState

NEXT_STEPS.md                ← Detailed handoff instructions for Copilot
```

---

## Quick Start

```bash
npm install
npm install motion zustand
npm run dev
```

Open http://localhost:3000 — click "Get started" to enter the onboarding flow.

### Required: tsconfig.json path alias
Make sure `compilerOptions` in `tsconfig.json` includes:
```json
"baseUrl": ".",
"paths": {
  "@/*": ["./*"]
}
```
Without this, `@/lib/...` imports will error.

### Required: images
Place hobby images in `/public/images/` matching the filenames in `lib/hobbies.ts`:
```
/public/images/photography.png
/public/images/painting.png
/public/images/drawing.png
/public/images/writing.png
```

---

## Onboarding Flow

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
  ↓ yes                       ↓ no
/dashboard           /explore
(Phase 2)            (Phase 2)
```

---

## Adding New Hobbies

Edit `lib/hobbies.ts` — the grid adapts automatically:

```ts
export const HOBBIES: Hobby[] = [
  { id: "photography", label: "Photography", image: "/images/photography.png" },
  // add new entry here ↓
  { id: "gardening", label: "Gardening", image: "/images/gardening.png" },
];
```

No other files need to change.

---

## Phase 2 — Next Steps

See `NEXT_STEPS.md` for the full Copilot handoff checklist, including:
- Supabase anonymous sessions (no login required)
- PostHog event tracking per step
- Dashboard: skill level selector + resource cards + community section
- Foundry IQ integration for personalised recovery plans
- Explore page for the "no" swipe path

---

## Notes
- No user accounts required — anonymous Supabase sessions track journeys without sign-up, respecting the "users abandon things easily" design principle
- All illustrated components have clear `// PLACEHOLDER` comments marking where your custom artwork slots in
- The swipe card outer `<motion.div>` must stay in place when swapping in your illustrated component — it owns the drag physics