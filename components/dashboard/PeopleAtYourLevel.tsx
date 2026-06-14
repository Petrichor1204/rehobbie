"use client";

import { motion } from "motion/react";
import { FindPeersResult, SkillLevel } from "@/types";

const LEVEL_BADGE: Record<SkillLevel, string> = {
  novice: "novice",
  "getting-good": "getting good",
  advanced: "advanced",
  expert: "expert",
  "just-for-fun": "just for fun",
};

type Props = {
  result: FindPeersResult | null;
  loading: boolean;
  skillLevel: SkillLevel | null;
};

function PeerCard({
  match,
  index,
}: {
  match: FindPeersResult["matches"][0];
  index: number;
}) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 240, damping: 22 }}
      className="
        snap-start shrink-0 w-[220px] rounded-3xl p-5
        bg-gradient-to-br from-white to-rehobbie-green/15
        border-2 border-rehobbie-green/40 shadow-sm
        flex flex-col items-center text-center gap-3
        hover:border-rehobbie-green hover:-translate-y-0.5 transition-all
      "
    >
      <span className="text-4xl" aria-hidden="true">
        {match.emoji}
      </span>
      <span className="font-body text-[10px] uppercase tracking-wider text-rehobbie-muted bg-rehobbie-green/20 px-2 py-0.5 rounded-full">
        {match.platform}
      </span>
      <p className="font-sketch text-xl font-bold text-rehobbie-ink leading-tight">
        {match.name}
      </p>
      <p className="font-body text-xs text-rehobbie-subtext leading-snug">
        {match.hook}
      </p>
    </motion.div>
  );

  if (match.url) {
    return (
      <a
        href={match.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rehobbie-green rounded-3xl"
      >
        {inner}
      </a>
    );
  }

  return inner;
}

export function PeopleAtYourLevel({ result, loading, skillLevel }: Props) {
  if (!skillLevel) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="font-sketch text-2xl font-bold text-rehobbie-ink">
          people at your level
        </h2>
        <span className="font-body text-[10px] uppercase tracking-wider text-rehobbie-green-dark bg-rehobbie-green/20 px-2 py-0.5 rounded-full">
          AI
        </span>
      </div>
      <p className="font-body text-sm text-rehobbie-muted mb-5">
        others doing the same thing —{" "}
        <span className="font-semibold text-rehobbie-ink">{LEVEL_BADGE[skillLevel]}</span>
      </p>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full border-2 border-rehobbie-green/30 border-t-rehobbie-green"
          />
          <p className="font-sketch text-xl text-rehobbie-muted">finding your people…</p>
        </div>
      )}

      {!loading && result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-sketch text-2xl font-bold text-rehobbie-ink mb-5">
            {result.headline}
          </p>
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x">
            {result.matches.map((match, i) => (
              <PeerCard key={`${match.name}-${i}`} match={match} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
