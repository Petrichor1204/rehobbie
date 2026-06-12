"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { STOP_REASONS } from "@/lib/hobbies";
import { useOnboardingStore } from "@/store/onboarding";
import { ReasonChip } from "@/components/onboarding/ReasonChip";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { capture } from "@/lib/posthog";

export default function WhyStoppedPage() {
  const router = useRouter();
  const { stopReasons, toggleStopReason, favoriteHobby } = useOnboardingStore();

  const hasSelection = stopReasons.length > 0;

  function handleNext() {
    capture("onboarding_reason_selected", {
      reasons: stopReasons.map((r) => r.id),
    });
    router.push("/ready-check");
  }

  return (
    <OnboardingShell onBack={() => router.back()}>
      <div className="mb-8 text-center w-full flex flex-col items-center">
        <Image
          src="/images/why_stopped.png"
          alt="why did you stop?"
          width={800}
          height={199}
          priority
          className="w-full max-w-md h-auto"
        />
        {favoriteHobby && (
          <p className="font-body text-sm text-rehobbie-faint mt-2">
            you picked <span className="text-rehobbie-ink font-medium">{favoriteHobby.label}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
        {STOP_REASONS.map((reason, i) => (
          <motion.div
            key={reason.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 200, damping: 20 }}
            className="w-full"
          >
            <ReasonChip
              reason={reason}
              selected={!!stopReasons.find((r) => r.id === reason.id)}
              onToggle={toggleStopReason}
            />
          </motion.div>
        ))}
      </div>

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
