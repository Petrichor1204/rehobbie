"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { HOBBIES, NEW_HOBBIES } from "@/lib/hobbies";
import { discoverHobbies } from "@/lib/discover";
import { useOnboardingStore } from "@/store/onboarding";
import { PageFrame } from "@/components/PageFrame";
import { DiscoverHobbiesResult, Hobby } from "@/types";

const ALL_CATALOG: Hobby[] = [...HOBBIES, ...NEW_HOBBIES];

function hobbyById(id: string): Hobby | undefined {
  return ALL_CATALOG.find((h) => h.id === id);
}

function DiscoveryCard({
  hobby,
  hook,
  emoji,
  appeal,
  index,
  onPick,
}: {
  hobby: Hobby;
  hook: string;
  emoji: string;
  appeal: string;
  index: number;
  onPick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onPick}
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="
        relative w-full rounded-3xl overflow-hidden text-left
        bg-gradient-to-br from-white via-rehobbie-cream to-rehobbie-green/20
        border-2 border-rehobbie-border shadow-md
        hover:border-rehobbie-green transition-colors
        min-h-[280px] flex flex-col items-center justify-end pb-6 pt-8 px-6
      "
      aria-label={`Discover ${hobby.label}`}
    >
      <span
        className="absolute top-5 right-5 text-3xl"
        aria-hidden="true"
      >
        {emoji}
      </span>

      <div className="relative w-[clamp(100px,28vw,140px)] h-[clamp(100px,28vw,140px)] mb-4">
        <Image
          src={hobby.image}
          alt={hobby.label}
          width={140}
          height={140}
          className="object-contain w-full h-full drop-shadow-md"
          draggable={false}
        />
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-3 w-[55%] rounded-[50%] bg-rehobbie-ink/20 blur-[5px]" />
      </div>

      <p className="font-sketch text-[clamp(1.6rem,4.5vw,2.2rem)] font-bold text-rehobbie-ink text-center leading-tight">
        {hook}
      </p>
      <p className="font-body text-xs text-rehobbie-muted text-center mt-1.5 max-w-[200px]">
        {appeal}
      </p>
    </motion.button>
  );
}

export default function ExplorePage() {
  const router = useRouter();
  const { startDiscovery } = useOnboardingStore();

  const [result, setResult] = useState<DiscoverHobbiesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);

    const state = useOnboardingStore.getState();
    const tried = new Set([
      ...state.selectedHobbies.map((h) => h.id),
      ...(state.favoriteHobby ? [state.favoriteHobby.id] : []),
    ]);
    const available = ALL_CATALOG.filter((h) => !tried.has(h.id));

    discoverHobbies({
      triedHobbies: state.selectedHobbies.map((h) => ({ id: h.id, label: h.label })),
      rejectedHobby: state.favoriteHobby
        ? { id: state.favoriteHobby.id, label: state.favoriteHobby.label }
        : null,
      stopReasons: state.stopReasons.map((r) => ({ id: r.id, label: r.label })),
      catalog: available.map((h) => ({ id: h.id, label: h.label })),
    })
      .then((data) => {
        if (id === requestId.current) setResult(data);
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, []);

  function handlePick(hobby: Hobby) {
    startDiscovery(hobby);
    router.push("/dashboard");
  }

  return (
    <PageFrame onBack={() => router.push("/")} backLabel="← Home">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 rounded-full border-[3px] border-rehobbie-green/30 border-t-rehobbie-green"
          />
          <p className="font-sketch text-3xl text-rehobbie-ink/60">
            finding your next thing…
          </p>
        </div>
      ) : result ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="mb-10 text-center">
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-xs uppercase tracking-[0.25em] text-rehobbie-muted mb-3"
              >
                brand new
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-sketch text-[clamp(2.2rem,6vw,3.5rem)] font-bold text-rehobbie-ink leading-none"
              >
                {result.headline}
              </motion.h1>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {result.suggestions.map((s, i) => {
                const hobby = hobbyById(s.hobbyId);
                if (!hobby) return null;
                return (
                  <DiscoveryCard
                    key={s.hobbyId}
                    hobby={hobby}
                    hook={s.hook}
                    emoji={s.emoji}
                    appeal={s.appeal}
                    index={i}
                    onPick={() => handlePick(hobby)}
                  />
                );
              })}
            </div>
          </motion.div>
      ) : null}
    </PageFrame>
  );
}
