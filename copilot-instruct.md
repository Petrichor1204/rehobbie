# Rehobbie — Copilot Handoff & Next Steps

## What's been built

All five onboarding pages are scaffolded and wired together:

| Route | File | Status |
|---|---|---|
| `/` | `app/page.tsx` | ✅ Home — floating icons, get started |
| `/onboarding` | `app/onboarding/page.tsx` | ✅ Hobby picker — multi-select grid |
| `/select-favorite` | `app/select-favorite/page.tsx` | ✅ Pick favourite hobby |
| `/why-stopped` | `app/why-stopped/page.tsx` | ✅ Reason chips — multi-select |
| `/ready-check` | `app/ready-check/page.tsx` | ✅ Swipe card — yes/no |
| `/dashboard` | `app/dashboard/page.tsx` | 🔲 Phase 2 placeholder |
| `/explore` | `app/explore/page.tsx` | 🔲 Phase 2 placeholder |

---

## Step 1 — Install dependencies

```bash
npm install motion zustand
# motion = framer-motion fork used for all animations
# zustand = lightweight state management across steps
```

---

## Step 2 — Add your images

All hobby images are expected in `/public/images/`. The filenames must match `lib/hobbies.ts`:

```
/public/images/photography.png
/public/images/painting.png
/public/images/drawing.png
/public/images/writing.png
```

For the home page floating icons, add extras too:
```
/public/images/gardening.png   ← you already have this one
/public/images/cooking.png
/public/images/music.png
/public/images/singing.png
/public/images/karate.png
```

If you don't have some of these yet, remove the missing entries from the
`FLOATING_ICONS` array in `app/page.tsx` temporarily to avoid broken images.

---

## Step 3 — Fix the `useMotionValue` import in SwipeCard

The SwipeCard uses `useMotionValue`, `useTransform`, `useAnimation` from `motion/react`.
If Copilot sees a type error, it's likely a version mismatch. Try:

```ts
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
```
Both `motion/react` and `framer-motion` work depending on your installed version.

---

## Step 4 — Replace SwipeCard internals with your illustrated component

In `components/onboarding/SwipeCard.tsx`, find this comment:

```
// PLACEHOLDER: Your custom illustrated card component goes here.
// Replace everything inside this <motion.div> with your component.
// The outer <motion.div> MUST stay — it handles the drag physics.
```

Keep the outer `<motion.div drag="x" ...>` wrapper intact.
Put your illustrated card component inside it:

```tsx
<motion.div drag="x" ...>
  <YourCardComponent question="wanna pick up where you left off?" />
</motion.div>
```

---

## Step 5 — Replace home page floating icons with your illustrated components

In `app/page.tsx`, the `FLOATING_ICONS` array drives the floating illustrations.
Each entry renders a plain `<Image />`. Replace with your custom component:

```tsx
// Before:
<Image src={icon.src} alt={icon.alt} width={icon.size} height={icon.size} />

// After (example with your component):
<YourHobbyIcon id={icon.id} size={icon.size} />
```

The `motion.div` wrapper stays — it handles the floating animation.

---

## Step 6 — Connect Supabase (anonymous sessions)

Install: `npm install @supabase/supabase-js`

In `lib/supabase.ts`:
```ts
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

For **anonymous sessions** (no login required), call `supabase.auth.signInAnonymously()`
on first load and store the session. This lets you track journeys without
requiring sign-up — perfect for your "users abandon things" design principle.

At the end of `app/ready-check/page.tsx`, after `handleSwipe`, write the
completed onboarding state to a `sessions` table in Supabase:

```ts
async function handleSwipe(wantsToResume: boolean) {
  setWantsToResume(wantsToResume);
  await supabase.from("sessions").insert({
    selected_hobbies: selectedHobbies.map(h => h.id),
    favorite_hobby: favoriteHobby?.id,
    stop_reasons: stopReasons.map(r => r.id),
    wants_to_resume: wantsToResume,
  });
  router.push(wantsToResume ? "/dashboard" : "/explore");
}
```

---

## Step 7 — Build the Dashboard (Phase 2)

`app/dashboard/page.tsx` is the post-yes destination. Build it with:

1. **Skill level selector** — horizontally scrollable pill row
   - Options: Novice / Getting good / Advanced / Expert / Just for fun
   - Store selection in `useOnboardingStore` → `skillLevel`

2. **Resource cards** — books, YouTube, communities relevant to the hobby
   - Start with hardcoded data in `lib/resources.ts` keyed by hobby ID
   - Later: pull from Supabase or a CMS

3. **"Others like you" section** — social proof / community feel
   - Can be mocked initially with static copy

---

## Step 8 — Add FoundryIQ / Copilot AI features

FoundryIQ (Microsoft intelligence) can be used to:
- Generate personalised resource recommendations based on hobby + skill level
- Suggest a "re-entry plan" (e.g. "spend 20 minutes this weekend...")
- Power the "explore other hobbies" page with similar hobby suggestions

Hook it into the dashboard page once the UI shell is solid.

---

## File structure reminder

```
app/
  page.tsx                   ← Home
  onboarding/page.tsx        ← Step 1: hobby picker
  select-favorite/page.tsx   ← Step 2: pick favourite
  why-stopped/page.tsx       ← Step 3: stop reasons
  ready-check/page.tsx       ← Step 4: swipe card
  dashboard/page.tsx         ← Phase 2: yes path
  explore/page.tsx           ← Phase 2: no path

components/onboarding/
  HobbyCard.tsx              ← individual hobby tile
  ReasonChip.tsx             ← stop reason pill button
  SwipeCard.tsx              ← swipable yes/no card

lib/
  hobbies.ts                 ← add new hobbies + reasons here
  supabase.ts                ← TODO: init client

store/
  onboarding.ts              ← Zustand store (all step state)

types/
  index.ts                   ← TypeScript types
```

---

## Checklist before testing

- [ ] `npm install motion zustand`
- [ ] Images added to `/public/images/`
- [ ] `.env.local` created with Supabase keys
- [ ] `npm run dev` → open http://localhost:3000
- [ ] Click through all 4 onboarding steps end-to-end
- [ ] Test swipe left and swipe right on `/ready-check`
- [ ] Test with only 1 hobby selected (should skip `/select-favorite`)