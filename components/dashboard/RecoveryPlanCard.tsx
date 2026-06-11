"use client";

import { motion, AnimatePresence } from "motion/react";
import { RecoveryPlan } from "@/types";

type Props = {
  plan: RecoveryPlan | null;
  loading: boolean;
  hasSkillLevel: boolean;
};

export function RecoveryPlanCard({ plan, loading, hasSkillLevel }: Props) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-sketch text-2xl font-bold text-rehobbie-ink">
          Your comeback plan
        </h2>
        <span className="font-body text-[10px] uppercase tracking-wider text-rehobbie-green-dark bg-rehobbie-green/20 px-2 py-0.5 rounded-full">
          AI
        </span>
      </div>

      <div className="rounded-3xl border-2 border-rehobbie-border bg-white shadow-sm p-6 min-h-[160px]">
        <AnimatePresence mode="wait">
          {!hasSkillLevel && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-body text-sm text-rehobbie-muted h-full flex items-center justify-center text-center py-8"
            >
              Pick your level above and I&apos;ll build your personalised plan.
            </motion.p>
          )}

          {hasSkillLevel && loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-3 py-10"
            >
              <span className="h-6 w-6 rounded-full border-2 border-rehobbie-green border-t-transparent animate-spin" />
              <p className="font-body text-sm text-rehobbie-muted">
                building your plan…
              </p>
            </motion.div>
          )}

          {hasSkillLevel && !loading && plan && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="font-sketch text-2xl font-semibold text-rehobbie-ink">
                {plan.headline}
              </h3>
              <p className="font-body text-sm text-rehobbie-subtext mt-1 mb-5">
                {plan.intro}
              </p>

              <ol className="flex flex-col gap-4">
                {plan.steps.map((step, i) => (
                  <motion.li
                    key={`${step.title}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3"
                  >
                    <span className="shrink-0 w-7 h-7 rounded-full bg-rehobbie-green/30 text-rehobbie-green-dark font-sketch font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-body font-semibold text-rehobbie-ink">
                          {step.title}
                        </span>
                        <span className="font-body text-xs text-rehobbie-muted">
                          {step.duration}
                        </span>
                      </div>
                      <p className="font-body text-sm text-rehobbie-subtext leading-snug">
                        {step.detail}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ol>

              <p className="font-sketch text-lg text-rehobbie-green-dark mt-6">
                {plan.encouragement}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
