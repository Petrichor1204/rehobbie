"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import { useOnboardingStore } from "@/store/onboarding";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { capture } from "@/lib/posthog";
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
    capture("onboarding_favourite_set", { hobby: hobby.id });
    setTimeout(() => router.push("/why-stopped"), 300);
  }

  if (selectedHobbies.length <= 1) {
    return null;
  }

  return (
    <OnboardingShell onBack={() => router.back()}>
      <h2 className="font-sketch text-3xl font-bold text-center text-rehobbie-ink mb-2 leading-snug w-full">
        Which one did you enjoy the most?
      </h2>
      <p className="font-body text-sm text-center text-rehobbie-faint mb-10 w-full">
        pick just one to focus on
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
        {selectedHobbies.map((hobby, i) => {
          const isSelected = favoriteHobby?.id === hobby.id;
          return (
            <motion.button
              key={hobby.id}
              onClick={() => handleSelect(hobby)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 220, damping: 20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`
                flex items-center justify-center gap-5 px-6 py-4 rounded-2xl
                bg-white border-2 shadow-sm transition-all w-full
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
            </motion.button>
          );
        })}
      </div>
    </OnboardingShell>
  );
}
