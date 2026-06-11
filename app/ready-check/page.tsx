"use client";
// app/ready-check/page.tsx — STEP 4: "Wanna pick up where you left off?"
// ─────────────────────────────────────────────────────────────────────────────
// Matches Figma "/page-2":
//   - Swipable card in centre
//   - "no" on left, "yes!" on right
//   - Swipe right → /dashboard (resume path)
//   - Swipe left  → /explore   (explore other hobbies)
// ─────────────────────────────────────────────────────────────────────────────

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useOnboardingStore } from "@/store/onboarding";
import { SwipeCard } from "@/components/onboarding/SwipeCard";

export default function ReadyCheckPage() {
  const router = useRouter();
  const { favoriteHobby, setWantsToResume } = useOnboardingStore();

  function handleSwipe(wantsToResume: boolean) {
    setWantsToResume(wantsToResume);
    router.push(wantsToResume ? "/dashboard" : "/explore");
  }

  return (
    <main className="relative min-h-screen bg-rehobbie-cream overflow-hidden">

      <div className="absolute inset-0 pointer-events-none lined-paper" aria-hidden="true" />

      <div className="relative z-10 max-w-lg mx-auto px-6 py-10 flex flex-col min-h-screen">

        <button
          onClick={() => router.back()}
          className="self-start mb-6 text-rehobbie-muted font-body text-sm flex items-center gap-1 hover:text-rehobbie-subtext-dark transition-colors"
        >
          ← Back
        </button>

        {favoriteHobby && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-sm text-center text-rehobbie-faint mb-4"
          >
            you chose <span className="text-rehobbie-ink font-semibold">{favoriteHobby.label}</span>
          </motion.p>
        )}

        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
            className="w-full"
          >
            <SwipeCard onSwipe={handleSwipe} />
          </motion.div>
        </div>

        <p className="text-center text-xs text-rehobbie-fainter font-body pb-6">
          swipe or tap to decide
        </p>
      </div>
    </main>
  );
}
