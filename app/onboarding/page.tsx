"use client";
// app/onboarding/page.tsx — STEP 1: "What hobbies did you used to like?"
// ─────────────────────────────────────────────────────────────────────────────
// Matches Figma "/onboarding" frame:
//   - Lined-paper aesthetic background
//   - Question at top in sketch font
//   - 2-column grid of hobby cards (grows automatically when more hobbies added)
//   - "Next" button appears once ≥1 hobby is selected
//   - Navigates to /select-favorite (or /why-stopped if only 1 selected)
// ─────────────────────────────────────────────────────────────────────────────

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { HOBBIES } from "@/lib/hobbies";
import { useOnboardingStore } from "@/store/onboarding";
import { HobbyCard } from "@/components/onboarding/HobbyCard";
import { Hobby } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { selectedHobbies, toggleHobby } = useOnboardingStore();

  function handleToggle(hobby: Hobby) {
    toggleHobby(hobby);
  }

  function handleNext() {
    if (selectedHobbies.length === 0) return;
    // If only 1 hobby selected, skip "pick favourite" step
    if (selectedHobbies.length === 1) {
      useOnboardingStore.getState().setFavoriteHobby(selectedHobbies[0]);
      router.push("/why-stopped");
    } else {
      router.push("/select-favorite");
    }
  }

  const hasSelection = selectedHobbies.length > 0;

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

        <h2 className="font-sketch text-3xl font-bold text-center text-rehobbie-ink mb-8 leading-snug">
          What hobbies did you used to like?
        </h2>

        <div
          className="grid gap-4 w-full"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
        >
          {HOBBIES.map((hobby, i) => (
            <motion.div
              key={hobby.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 18 }}
            >
              <HobbyCard
                hobby={hobby}
                selected={!!selectedHobbies.find((h) => h.id === hobby.id)}
                onToggle={handleToggle}
              />
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-rehobbie-faint font-body">
          {hasSelection
            ? `${selectedHobbies.length} selected — pick as many as you like`
            : "tap one or more to continue"}
        </p>

        <div className="mt-auto pt-8 pb-4">
          <AnimatePresence>
            {hasSelection && (
              <motion.button
                key="next-btn"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                onClick={handleNext}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="
                  w-full py-4 rounded-full
                  bg-rehobbie-ink text-white
                  font-sketch text-2xl font-semibold
                  shadow-md hover:bg-rehobbie-subtext-dark transition-colors
                "
              >
                Next →
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
