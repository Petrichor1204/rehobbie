"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useOnboardingStore } from "@/store/onboarding";
import { SwipeCard } from "@/components/onboarding/SwipeCard";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { capture } from "@/lib/posthog";
import { saveSession } from "@/lib/supabase";

export default function ReadyCheckPage() {
  const router = useRouter();
  const { selectedHobbies, favoriteHobby, stopReasons, skillLevel, setWantsToResume } =
    useOnboardingStore();

  function handleSwipe(wantsToResume: boolean) {
    setWantsToResume(wantsToResume);

    capture("onboarding_swipe_decision", { wants_to_resume: wantsToResume });

    // Persist the completed journey (fire-and-forget; no-op without Supabase).
    void saveSession({
      selected_hobbies: selectedHobbies.map((h) => h.id),
      favorite_hobby: favoriteHobby?.id ?? null,
      stop_reasons: stopReasons.map((r) => r.id),
      wants_to_resume: wantsToResume,
      skill_level: skillLevel,
    });

    router.push(wantsToResume ? "/dashboard" : "/explore");
  }

  return (
    <OnboardingShell onBack={() => router.back()}>
      {favoriteHobby && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-body text-sm text-center text-rehobbie-faint mb-4 w-full"
        >
          you chose <span className="text-rehobbie-ink font-semibold">{favoriteHobby.label}</span>
        </motion.p>
      )}

      <div className="flex-1 flex items-center justify-center w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
          className="w-full flex justify-center"
        >
          <SwipeCard onSwipe={handleSwipe} />
        </motion.div>
      </div>

      <p className="text-center text-xs text-rehobbie-fainter font-body pb-6 w-full">
        swipe or tap to decide
      </p>
    </OnboardingShell>
  );
}
