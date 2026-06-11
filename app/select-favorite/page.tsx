"use client";
// app/select-favorite/page.tsx — STEP 2: "Which one did you enjoy the most?"
// ─────────────────────────────────────────────────────────────────────────────
// Only shown when user selected MORE than one hobby on the previous step.
// Displays each selected hobby as a large tappable card.
// Tapping one sets it as the favourite and navigates to /why-stopped.
// ─────────────────────────────────────────────────────────────────────────────

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import { useOnboardingStore } from "@/store/onboarding";
import { Hobby } from "@/types";

export default function SelectFavoritePage() {
  const router = useRouter();
  const { selectedHobbies, setFavoriteHobby, favoriteHobby } = useOnboardingStore();

  function handleSelect(hobby: Hobby) {
    setFavoriteHobby(hobby);
    // Brief delay so the selection animation plays before navigating
    setTimeout(() => router.push("/why-stopped"), 300);
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

        {/* ── Heading ─────────────────────────────────────────────────────────── */}
        <h2 className="font-sketch text-3xl font-bold text-center text-[#2D2D2D] mb-2 leading-snug">
          Which one did you enjoy the most?
        </h2>
        <p className="font-body text-sm text-center text-[#AAA] mb-10">
          pick just one to focus on
        </p>

        {/* ── Hobby options ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 w-full">
          {selectedHobbies.map((hobby, i) => {
            const isSelected = favoriteHobby?.id === hobby.id;
            return (
              <motion.button
                key={hobby.id}
                onClick={() => handleSelect(hobby)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 220, damping: 20 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  flex items-center gap-5 px-6 py-4 rounded-2xl
                  bg-white border-2 shadow-sm transition-all
                  ${isSelected
                    ? "border-[#A8D8B0] shadow-[0_0_0_3px_#A8D8B033]"
                    : "border-[#E5E1D8] hover:border-[#C8C4BC]"
                  }
                `}
                aria-pressed={isSelected}
              >
                {/*
                  ────────────────────────────────────────────────────────────────
                  PLACEHOLDER: hobby illustration (large, left-aligned)
                  Replace with your custom illustrated component if needed.
                  Images come from /public/images/ — set in lib/hobbies.ts.
                  ────────────────────────────────────────────────────────────────
                */}
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src={hobby.image}
                    alt={hobby.label}
                    width={64}
                    height={64}
                    className="object-contain drop-shadow-sm"
                    draggable={false}
                  />
                </div>

                <span className="font-sketch text-2xl font-semibold text-[#2D2D2D]">
                  {hobby.label}
                </span>

                {/* Arrow hint */}
                <span className="ml-auto text-[#CCC] text-xl">→</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </main>
  );
}