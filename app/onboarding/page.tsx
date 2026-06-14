"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { HOBBIES } from "@/lib/hobbies";
import { useOnboardingStore } from "@/store/onboarding";
import { HobbyCard } from "@/components/onboarding/HobbyCard";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { capture } from "@/lib/posthog";

export default function OnboardingPage() {
  const router = useRouter();
  const { selectedHobbies, toggleHobby } = useOnboardingStore();

  function handleNext() {
    if (selectedHobbies.length === 0) return;
    capture("onboarding_hobby_selected", {
      hobbies: selectedHobbies.map((h) => h.id),
      count: selectedHobbies.length,
    });
    if (selectedHobbies.length === 1) {
      useOnboardingStore.getState().setFavoriteHobby(selectedHobbies[0]);
      router.push("/why-stopped");
    } else {
      router.push("/select-favorite");
    }
  }

  const hasSelection = selectedHobbies.length > 0;

  return (
    <OnboardingShell onBack={() => router.back()}>
      <Image
        src="/images/used_to_like_heading.png"
        alt="What hobbies did you used to like?"
        width={1308}
        height={195}
        priority
        className="w-full max-w-xl h-auto mx-auto mb-10"
      />

      <div className="grid grid-cols-2 gap-5 w-full max-w-sm mx-auto justify-items-center">
        {HOBBIES.map((hobby, i) => (
          <motion.div
            key={hobby.id}
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 18 }}
          >
            <HobbyCard
              hobby={hobby}
              selected={!!selectedHobbies.find((h) => h.id === hobby.id)}
              onToggle={toggleHobby}
            />
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-rehobbie-faint font-body w-full">
        {hasSelection
          ? `${selectedHobbies.length} selected — pick as many as you like`
          : "tap one or more to continue"}
      </p>

      <div className="mt-auto pt-8 pb-4 w-full max-w-sm mx-auto">
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
    </OnboardingShell>
  );
}
