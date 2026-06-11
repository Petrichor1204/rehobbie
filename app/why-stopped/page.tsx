"use client";
// app/why-stopped/page.tsx — STEP 3: "Why did you stop?"
// ─────────────────────────────────────────────────────────────────────────────
// Matches Figma "/page" frame:
//   - Lined-paper background
//   - "why did you stop?" heading
//   - Full-width pill-shaped reason buttons (multi-select)
//   - "Next" button when ≥1 reason selected
// ─────────────────────────────────────────────────────────────────────────────

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { STOP_REASONS } from "@/lib/hobbies";
import { useOnboardingStore } from "@/store/onboarding";
import { ReasonChip } from "@/components/onboarding/ReasonChip";
import { StopReason } from "@/types";

export default function WhyStoppedPage() {
  const router = useRouter();
  const { stopReasons, toggleStopReason, favoriteHobby } = useOnboardingStore();

  function handleToggle(reason: StopReason) {
    toggleStopReason(reason);
  }

  const hasSelection = stopReasons.length > 0;

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

        <div className="mb-8 text-center">
          <h2 className="font-sketch text-3xl font-bold text-rehobbie-ink leading-snug">
            why did you stop?
          </h2>
          {favoriteHobby && (
            <p className="font-body text-sm text-rehobbie-faint mt-1">
              you picked <span className="text-rehobbie-ink font-medium">{favoriteHobby.label}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full">
          {STOP_REASONS.map((reason, i) => (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 200, damping: 20 }}
            >
              <ReasonChip
                reason={reason}
                selected={!!stopReasons.find((r) => r.id === reason.id)}
                onToggle={handleToggle}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-auto pt-8 pb-4">
          <AnimatePresence>
            {hasSelection && (
              <motion.button
                key="next-btn"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                onClick={() => router.push("/ready-check")}
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
