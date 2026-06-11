"use client";
// app/explore/page.tsx — Phase 2: the "swipe no" destination.
// Shows the hobbies they didn't pick + a few brand-new suggestions. Tapping any
// card restarts the flow with that hobby pre-selected.

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { HOBBIES, NEW_HOBBIES } from "@/lib/hobbies";
import { useOnboardingStore } from "@/store/onboarding";
import { PageFrame } from "@/components/PageFrame";
import { Hobby } from "@/types";

function ExploreCard({
  hobby,
  index,
  onPick,
}: {
  hobby: Hobby;
  index: number;
  onPick: (h: Hobby) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onPick(hobby)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 220, damping: 20 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="
        group flex flex-col items-center gap-3 rounded-3xl p-5
        bg-white border-2 border-rehobbie-border shadow-sm
        hover:border-rehobbie-green transition-colors
      "
      aria-label={`Start ${hobby.label}`}
    >
      <div className="relative w-28 h-28 flex items-center justify-center">
        <Image
          src={hobby.image}
          alt={hobby.label}
          width={112}
          height={112}
          className="object-contain drop-shadow-sm"
          draggable={false}
        />
      </div>
      <span className="font-sketch text-2xl font-semibold text-rehobbie-ink">
        {hobby.label}
      </span>
      <span className="font-body text-xs text-rehobbie-muted opacity-0 group-hover:opacity-100 transition-opacity">
        tap to start →
      </span>
    </motion.button>
  );
}

export default function ExplorePage() {
  const router = useRouter();
  const { selectedHobbies, restartWithHobby } = useOnboardingStore();

  const pickedIds = new Set(selectedHobbies.map((h) => h.id));
  const otherHobbies = HOBBIES.filter((h) => !pickedIds.has(h.id));
  const surprises = NEW_HOBBIES.filter((h) => !pickedIds.has(h.id)).slice(0, 4);

  function handlePick(hobby: Hobby) {
    restartWithHobby(hobby);
    // One hobby pre-selected, so /select-favorite is skipped → continue at reasons.
    router.push("/why-stopped");
  }

  return (
    <PageFrame onBack={() => router.push("/")} backLabel="← Home">
      <header className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-sketch text-4xl font-bold text-rehobbie-ink leading-tight"
        >
          No worries — let&apos;s find a better fit
        </motion.h1>
        <p className="font-body text-sm text-rehobbie-muted mt-2">
          maybe a different hobby is calling you back
        </p>
      </header>

      {otherHobbies.length > 0 && (
        <section className="mb-12">
          <h2 className="font-sketch text-2xl font-bold text-rehobbie-ink mb-1">
            Hobbies you didn&apos;t pick
          </h2>
          <p className="font-body text-sm text-rehobbie-muted mb-5">
            one of these might be the one
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {otherHobbies.map((hobby, i) => (
              <ExploreCard key={hobby.id} hobby={hobby} index={i} onPick={handlePick} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-sketch text-2xl font-bold text-rehobbie-ink mb-1">
          Something completely new?
        </h2>
        <p className="font-body text-sm text-rehobbie-muted mb-5">
          a fresh start can be the most fun
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {surprises.map((hobby, i) => (
            <ExploreCard key={hobby.id} hobby={hobby} index={i} onPick={handlePick} />
          ))}
        </div>
      </section>
    </PageFrame>
  );
}
