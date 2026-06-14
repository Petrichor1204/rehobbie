"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { RecoveryPlan } from "@/types";

const SLIDE_GRADIENTS = [
  "from-[#8FD3A6] via-[#CFEBD4] to-[#FBF1DA]",
  "from-[#F7C39B] via-[#FBF1DA] to-[#E8D5B5]",
  "from-[#B8D4E8] via-[#D4E8F0] to-[#FBF1DA]",
  "from-[#D4B8E8] via-[#E8D4F0] to-[#FBF1DA]",
  "from-[#8FD3A6] via-[#A8D8B0] to-[#CFEBD4]",
  "from-[#F7C39B] via-[#F0A878] to-[#E8956A]",
];

type Slide =
  | { kind: "intro"; headline: string; intro: string }
  | { kind: "step"; index: number; title: string; duration: string; detail: string }
  | { kind: "outro"; encouragement: string };

function buildSlides(plan: RecoveryPlan): Slide[] {
  return [
    { kind: "intro", headline: plan.headline, intro: plan.intro },
    ...plan.steps.map((s, i) => ({
      kind: "step" as const,
      index: i + 1,
      title: s.title,
      duration: s.duration,
      detail: s.detail,
    })),
    { kind: "outro", encouragement: plan.encouragement },
  ];
}

type Props = {
  plan: RecoveryPlan | null;
  loading: boolean;
  hasSkillLevel: boolean;
  hobbyImage?: string;
  hobbyLabel?: string;
  isDiscovery?: boolean;
};

export function RecoveryPlanWrapped({
  plan,
  loading,
  hasSkillLevel,
  hobbyImage,
  hobbyLabel,
  isDiscovery,
}: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const slides = plan ? buildSlides(plan) : [];
  const total = slides.length;
  const current = slides[index];

  useEffect(() => {
    setIndex(0);
    setDirection(1);
  }, [plan]);

  const advance = useCallback(() => {
    if (index < total - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    }
  }, [index, total]);

  const goBack = useCallback(() => {
    if (index > 0) {
      setDirection(-1);
      setIndex((i) => i - 1);
    }
  }, [index]);

  const variants = {
    enter: (d: number) => ({ opacity: 0, scale: 0.88, y: d > 0 ? 60 : -60 }),
    center: { opacity: 1, scale: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, scale: 0.92, y: d > 0 ? -40 : 40 }),
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-sketch text-2xl font-bold text-rehobbie-ink">
          {isDiscovery ? "your first steps" : "your comeback plan"}
        </h2>
        <span className="font-body text-[10px] uppercase tracking-wider text-rehobbie-green-dark bg-rehobbie-green/20 px-2 py-0.5 rounded-full">
          AI
        </span>
      </div>

      <div
        className="relative w-full rounded-3xl overflow-hidden shadow-lg cursor-pointer select-none"
        style={{ minHeight: "clamp(380px, 55vh, 480px)" }}
        onClick={advance}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === " ") advance();
          if (e.key === "ArrowLeft") goBack();
        }}
        role="button"
        tabIndex={0}
        aria-label="Tap to see next slide"
      >
        <AnimatePresence mode="wait">
          {!hasSkillLevel && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-rehobbie-cream border-2 border-rehobbie-border rounded-3xl"
            >
              <p className="font-sketch text-2xl text-rehobbie-muted text-center px-8">
                pick your level ↑
              </p>
            </motion.div>
          )}

          {hasSkillLevel && loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-rehobbie-green/30 to-rehobbie-cream rounded-3xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full border-[3px] border-rehobbie-ink/20 border-t-rehobbie-ink mb-4"
              />
              <p className="font-sketch text-2xl text-rehobbie-ink/70">building…</p>
            </motion.div>
          )}

          {hasSkillLevel && !loading && current && (
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className={`absolute inset-0 flex flex-col items-center justify-center px-8 py-10 bg-gradient-to-br ${SLIDE_GRADIENTS[index % SLIDE_GRADIENTS.length]}`}
            >
              {current.kind === "intro" && (
                <>
                  {hobbyImage && (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                      className="mb-6"
                    >
                      <Image
                        src={hobbyImage}
                        alt={hobbyLabel ?? ""}
                        width={120}
                        height={120}
                        className="w-[clamp(80px,18vw,120px)] h-auto drop-shadow-lg"
                        draggable={false}
                      />
                    </motion.div>
                  )}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="font-body text-xs uppercase tracking-[0.2em] text-rehobbie-ink/50 mb-3"
                  >
                    {isDiscovery ? "discover" : "comeback"}
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="font-sketch text-[clamp(2rem,6vw,3.2rem)] font-bold text-rehobbie-ink text-center leading-none"
                  >
                    {current.headline}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="font-body text-sm text-rehobbie-ink/60 text-center mt-4 max-w-xs"
                  >
                    {current.intro}
                  </motion.p>
                </>
              )}

              {current.kind === "step" && (
                <>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="font-sketch text-[clamp(5rem,18vw,8rem)] font-bold text-rehobbie-ink/15 leading-none mb-2"
                  >
                    {current.index}
                  </motion.span>
                  <motion.h3
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-sketch text-[clamp(1.8rem,5vw,2.8rem)] font-bold text-rehobbie-ink text-center leading-tight max-w-sm"
                  >
                    {current.title}
                  </motion.h3>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 }}
                    className="mt-4 inline-block rounded-full bg-rehobbie-ink/10 px-5 py-1.5 font-sketch text-xl text-rehobbie-ink"
                  >
                    {current.duration}
                  </motion.span>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="font-body text-sm text-rehobbie-ink/55 text-center mt-5 max-w-xs leading-snug"
                  >
                    {current.detail}
                  </motion.p>
                </>
              )}

              {current.kind === "outro" && (
                <>
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    className="text-[clamp(3rem,10vw,5rem)] mb-6"
                    aria-hidden="true"
                  >
                    ✨
                  </motion.span>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-sketch text-[clamp(1.6rem,4.5vw,2.4rem)] font-bold text-rehobbie-ink text-center leading-snug max-w-sm"
                  >
                    {current.encouragement}
                  </motion.p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots + tap hint */}
        {hasSkillLevel && !loading && total > 0 && (
          <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-rehobbie-ink" : "w-1.5 bg-rehobbie-ink/25"
                  }`}
                />
              ))}
            </div>
            {index < total - 1 && (
              <span className="font-body text-[10px] text-rehobbie-ink/40 uppercase tracking-wider">
                tap for next →
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
