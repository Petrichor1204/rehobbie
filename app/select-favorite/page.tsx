"use client";
// app/select-favorite/page.tsx — STEP 2: "Which one did you enjoy the most?"
// ─────────────────────────────────────────────────────────────────────────────
// Only shown when user selected MORE than one hobby on the previous step.
// Displays each selected hobby as a large tappable card.
// Tapping one sets it as the favourite and navigates to /why-stopped.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import { useOnboardingStore } from "@/store/onboarding";
import { Hobby } from "@/types";

export default function SelectFavoritePage() {
  const router = useRouter();
  const { selectedHobbies, setFavoriteHobby, favoriteHobby } = useOnboardingStore();

  useEffect(() => {
    if (selectedHobbies.length <= 1) {
      if (selectedHobbies.length === 1) {
        setFavoriteHobby(selectedHobbies[0]);
      }
      router.replace("/why-stopped");
    }
  }, [selectedHobbies, setFavoriteHobby, router]);

  function handleSelect(hobby: Hobby) {
    setFavoriteHobby(hobby);
    setTimeout(() => router.push("/why-stopped"), 300);
  }

  if (selectedHobbies.length <= 1) {
    return null;
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

        <h2 className="font-sketch text-3xl font-bold text-center text-rehobbie-ink mb-2 leading-snug">
          Which one did you enjoy the most?
        </h2>
        <p className="font-body text-sm text-center text-rehobbie-faint mb-10">
          pick just one to focus on
        </p>

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
                    ? "border-rehobbie-green shadow-[0_0_0_3px_rgb(168_216_176/0.2)]"
                    : "border-rehobbie-border hover:border-rehobbie-border-light"
                  }
                `}
                aria-pressed={isSelected}
              >
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

                <span className="font-sketch text-2xl font-semibold text-rehobbie-ink">
                  {hobby.label}
                </span>

                <span className="ml-auto text-rehobbie-fainter text-xl">→</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
