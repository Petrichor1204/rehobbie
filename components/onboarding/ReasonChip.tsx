"use client";
// components/onboarding/ReasonChip.tsx
// ─────────────────────────────────────────────────────────────────────────────
// A wide rounded-rectangle button for the "Why did you stop?" step.
// Matches the Figma /page frame — pill-shaped, toggleable, full-width.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "motion/react";
import { StopReason } from "@/types";

type Props = {
  reason: StopReason;
  selected: boolean;
  onToggle: (reason: StopReason) => void;
};

export function ReasonChip({ reason, selected, onToggle }: Props) {
  return (
    <motion.button
      onClick={() => onToggle(reason)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`
        w-full py-4 px-6 rounded-full text-left
        border-2 transition-all duration-150 font-sketch text-xl
        ${selected
          ? "bg-[#2D2D2D] text-white border-[#2D2D2D]"
          : "bg-white text-[#2D2D2D] border-[#E5E1D8] hover:border-[#BFBBB2]"
        }
      `}
      aria-pressed={selected}
    >
      {reason.label}
    </motion.button>
  );
}