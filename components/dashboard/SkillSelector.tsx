"use client";

import { motion } from "motion/react";
import { SKILL_LEVELS } from "@/lib/hobbies";
import { SkillLevel } from "@/types";

type Props = {
  value: SkillLevel | null;
  onChange: (level: SkillLevel) => void;
};

export function SkillSelector({ value, onChange }: Props) {
  return (
    <section>
      <h2 className="font-sketch text-2xl font-bold text-rehobbie-ink mb-1">
        Where are you at?
      </h2>
      <p className="font-body text-sm text-rehobbie-muted mb-4">
        be honest — it tunes your plan
      </p>

      <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 snap-x">
        {SKILL_LEVELS.map((level) => {
          const active = value === level.id;
          return (
            <motion.button
              key={level.id}
              type="button"
              onClick={() => onChange(level.id)}
              whileTap={{ scale: 0.96 }}
              className={`
                snap-start shrink-0 w-36 text-left rounded-2xl border-2 px-4 py-3
                transition-all
                ${active
                  ? "bg-rehobbie-ink text-white border-rehobbie-ink shadow-md"
                  : "bg-white text-rehobbie-ink border-rehobbie-border hover:border-rehobbie-border-light"
                }
              `}
              aria-pressed={active}
            >
              <span className="font-sketch text-xl font-semibold block leading-tight">
                {level.label}
              </span>
              <span
                className={`font-body text-xs ${active ? "text-white/70" : "text-rehobbie-muted"}`}
              >
                {level.blurb}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
