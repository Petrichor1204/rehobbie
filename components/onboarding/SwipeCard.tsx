"use client";
// components/onboarding/SwipeCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// The swipable "wanna pick up where you left off?" card.
// Matches Figma "/page-2" — card in centre, "no ← swipe → yes!" labels.
//
// INTERACTION:
//   - Drag left  → "no"  (threshold: -80px)
//   - Drag right → "yes" (threshold: +80px)
//   - Tap "no" / "yes" labels also works
//   - On decision, onSwipe(true/false) is called by parent
//
// DEPENDENCIES: motion (npm install motion)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "motion/react";

type Props = {
  onSwipe: (wantsToResume: boolean) => void;
};

const SWIPE_THRESHOLD = 80; // px before a decision is locked in

export function SwipeCard({ onSwipe }: Props) {
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Card rotation: tilts as it's dragged
  const rotate = useTransform(x, [-200, 200], [-18, 18]);

  // Label opacity: "no" fades in on left drag, "yes" on right
  const noOpacity  = useTransform(x, [-120, -20, 0], [1, 0.3, 0.15]);
  const yesOpacity = useTransform(x, [0, 20, 120],   [0.15, 0.3, 1]);

  // Background tint: soft red on left, soft green on right
  const bgColor = useTransform(
    x,
    [-120, 0, 120],
    ["rgba(255,160,130,0.18)", "rgba(0,0,0,0)", "rgba(160,216,176,0.22)"]
  );

  const [isDragging, setIsDragging] = useState(false);

  async function handleDragEnd() {
    setIsDragging(false);
    const currentX = x.get();
    if (currentX < -SWIPE_THRESHOLD) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe(false);
    } else if (currentX > SWIPE_THRESHOLD) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe(true);
    } else {
      // Snap back
      controls.start({ x: 0, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  }

  async function handleTapDecision(yes: boolean) {
    await controls.start({
      x: yes ? 500 : -500,
      opacity: 0,
      transition: { duration: 0.35 },
    });
    onSwipe(yes);
  }

  return (
    <div className="relative flex items-center justify-center w-full" style={{ height: 320 }}>

      {/* ── "no" label (left) ────────────────────────────────────────────────── */}
      <motion.button
        style={{ opacity: noOpacity }}
        onClick={() => handleTapDecision(false)}
        className="absolute left-0 z-10 font-sketch text-2xl text-[#2D2D2D] select-none px-4 py-2 hover:scale-110 transition-transform"
        aria-label="No, I don't want to resume"
      >
        no
      </motion.button>

      {/* ── Swipable card ────────────────────────────────────────────────────── */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -220, right: 220 }}
        style={{ x, rotate, backgroundColor: bgColor }}
        animate={controls}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className="
          relative z-20 cursor-grab active:cursor-grabbing select-none
          w-64 h-64 rounded-3xl bg-[#F0EDE7]
          border-2 border-[#E0DBD0]
          shadow-[4px_4px_0px_#C8C4BC]
          flex flex-col items-center justify-center gap-3
          text-center px-6
        "
      >
        {/*
          ──────────────────────────────────────────────────────────────────────
          PLACEHOLDER: Your custom illustrated card component goes here.
          Replace everything inside this <motion.div> with your component.
          The outer <motion.div> MUST stay — it handles the drag physics.
          ──────────────────────────────────────────────────────────────────────
        */}

        {/* Card question text */}
        <p className="font-sketch text-2xl font-semibold text-[#2D2D2D] leading-snug">
          wanna pick up where you left off?
        </p>

        {/* Swipe hint icon */}
        <div className="mt-2 flex items-center gap-1 text-[#BFBBB2] font-body text-xs">
          <span>← swipe →</span>
        </div>

        {/* ── Motion ripple lines (matches Figma's wavy brackets) ────────────── */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-40" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-3 h-3 border-l-2 border-[#2D2D2D] rounded-l-full" style={{ marginLeft: i * 2 }} />
          ))}
        </div>
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-40" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-3 h-3 border-r-2 border-[#2D2D2D] rounded-r-full" style={{ marginRight: i * 2 }} />
          ))}
        </div>
      </motion.div>

      {/* ── "yes!" label (right) ─────────────────────────────────────────────── */}
      <motion.button
        style={{ opacity: yesOpacity }}
        onClick={() => handleTapDecision(true)}
        className="absolute right-0 z-10 font-sketch text-2xl text-[#2D2D2D] select-none px-4 py-2 hover:scale-110 transition-transform"
        aria-label="Yes, I want to resume"
      >
        yes!
      </motion.button>

      {/* ── "swipe" label underneath ─────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[#BFBBB2] font-body text-xs">
        <span>——</span>
        <span>swipe</span>
        <span>——</span>
      </div>
    </div>
  );
}