"use client";
// components/onboarding/HobbyCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// A single hobby card. Shows the hobby illustration + label.
// Clicking toggles selection (border highlight + checkmark).
//
// PLACEHOLDER NOTE: The Image inside is a standard Next.js Image.
// Replace with your own custom illustrated component if needed —
// just swap the <Image /> block and keep the outer <motion.button> wrapper.
// ─────────────────────────────────────────────────────────────────────────────

import Image from "next/image";
import { motion } from "motion/react";
import { Hobby } from "@/types";

type Props = {
  hobby: Hobby;
  selected: boolean;
  onToggle: (hobby: Hobby) => void;
};

export function HobbyCard({ hobby, selected, onToggle }: Props) {
  return (
    <motion.button
      onClick={() => onToggle(hobby)}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative flex flex-col items-center justify-center gap-2
        rounded-2xl p-4 w-full aspect-square
        border-2 transition-all duration-200 cursor-pointer
        bg-white shadow-sm
        ${selected
          ? "border-rehobbie-green shadow-[0_0_0_3px_rgb(168_216_176/0.2)]"
          : "border-rehobbie-border hover:border-rehobbie-border-light"
        }
      `}
      aria-pressed={selected}
      aria-label={hobby.label}
    >
      {/* ── Checkmark badge (shown when selected) ──────────────────────────── */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rehobbie-green flex items-center justify-center"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-rehobbie-ink">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      )}

      {/*
        ─────────────────────────────────────────────────────────────────────
        PLACEHOLDER: hobby illustration
        Place your image files in /public/images/ matching hobby.image path.
        e.g. /public/images/photography.png
        ─────────────────────────────────────────────────────────────────────
      */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <Image
          src={hobby.image}
          alt={hobby.label}
          width={96}
          height={96}
          className="object-contain drop-shadow-sm"
          draggable={false}
        />
      </div>

      {/* ── Label ──────────────────────────────────────────────────────────── */}
      <span className="font-sketch text-lg font-semibold text-rehobbie-ink leading-tight">
        {hobby.label}
      </span>
    </motion.button>
  );
}