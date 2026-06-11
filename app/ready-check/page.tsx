"use client";
// app/ready-check/page.tsx — STEP 4: "Wanna pick up where you left off?"
// ─────────────────────────────────────────────────────────────────────────────
// Matches Figma "/page-2":
//   - Swipable card in centre
//   - "no" on left, "yes!" on right
//   - Swipe right → /dashboard (resume path) — TODO: build dashboard
//   - Swipe left  → /explore   (explore other hobbies) — TODO: build explore
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
    if (wantsToResume) {
      // TODO: Navigate to dashboard/resources page (Phase 2)
      router.push("/dashboard");
    } else {
      // TODO: Navigate to explore-other-hobbies page (Phase 2)
      router.push("/explore");
    }
  }

  return (
    <main className="relative min-h-screen bg-[#FAF8F4] overflow-hidden">

      {/* ── Lined-paper background ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: "repeating-linear-gradient(transparent, transparent 39px, #E0DBD0 39px, #E0DBD0 40px)",
          backgroundPosition: "0 56px",
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-6 py-10 flex flex-col min-h-screen">

        {/* ── Back button ─────────────────────────────────────────────────────── */}
        <button
          onClick={() => router.back()}
          className="self-start mb-6 text-[#888] font-body text-sm flex items-center gap-1 hover:text-[#555] transition-colors"
        >
          ← Back
        </button>

        {/* ── Context — which hobby they picked ───────────────────────────────── */}
        {favoriteHobby && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-sm text-center text-[#AAA] mb-4"
          >
            you chose <span className="text-[#2D2D2D] font-semibold">{favoriteHobby.label}</span>
          </motion.p>
        )}

        {/* ── Swipe card ───────────────────────────────────────────────────────── */}
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

        {/* ── Hint text ────────────────────────────────────────────────────────── */}
        <p className="text-center text-xs text-[#CCC] font-body pb-6">
          swipe or tap to decide
        </p>
      </div>
    </main>
  );
}