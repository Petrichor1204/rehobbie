import {
  RecoveryPlan,
  RecoveryPlanInput,
  RecoveryStep,
  SkillLevel,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Microsoft Foundry IQ — AI recovery plan (Step 5b)
//
// This is the integration point for Foundry. Right now it returns a structured,
// deterministic plan generated locally so the dashboard works end-to-end. To go
// live, replace the body of `generateRecoveryPlan` with a Foundry call that
// returns the same `RecoveryPlan` shape, e.g.:
//
//   const res = await fetch(process.env.FOUNDRY_ENDPOINT!, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${process.env.FOUNDRY_KEY}` },
//     body: JSON.stringify({ prompt: buildPrompt(input) }),
//   });
//   return (await res.json()) as RecoveryPlan;
//
// Keeping the local generator below as a fallback is recommended.
// ─────────────────────────────────────────────────────────────────────────────

const SKILL_FRAMING: Record<SkillLevel, string> = {
  "novice": "starting fresh",
  "getting-good": "rebuilding momentum",
  "advanced": "sharpening skills you already have",
  "expert": "getting back into deep practice",
  "just-for-fun": "keeping it light and playful",
};

const SKILL_FIRST_STEP: Record<SkillLevel, RecoveryStep> = {
  "novice": {
    title: "One tiny first attempt",
    detail: "Don't aim for good — aim for done. Make the smallest possible thing today so the page isn't blank anymore.",
    duration: "15 min",
  },
  "getting-good": {
    title: "Redo an old favourite",
    detail: "Repeat something you've done before. Muscle memory comes back fast and reminds you that you can do this.",
    duration: "25 min",
  },
  "advanced": {
    title: "Pick one weak spot",
    detail: "Choose a single skill you always wanted to improve and drill just that. Focused reps beat broad practice.",
    duration: "30 min",
  },
  "expert": {
    title: "Start a real project",
    detail: "Skip the warm-ups. Begin something you'd actually be proud to finish — your skills are still in there.",
    duration: "45 min",
  },
  "just-for-fun": {
    title: "Do the fun part only",
    detail: "Skip anything that feels like homework. Go straight to the part you always enjoyed most.",
    duration: "20 min",
  },
};

const REASON_REMEDY: Record<string, RecoveryStep> = {
  "no-time": {
    title: "Shrink the session",
    detail: "Schedule a single 15-minute block this week. Tiny and consistent beats long and never.",
    duration: "15 min",
  },
  "lost-interest": {
    title: "Chase one spark",
    detail: "Find a single piece of work that excites you and try to recreate a small slice of it. Curiosity is the fuel.",
    duration: "20 min",
  },
  "too-hard": {
    title: "Drop the difficulty",
    detail: "Pick something two levels easier than where you got stuck. Confidence first, challenge later.",
    duration: "20 min",
  },
  "no-supplies": {
    title: "Use what you have",
    detail: "Start with the cheapest possible setup — your phone, free tools, scrap materials. Upgrade only once the habit sticks.",
    duration: "10 min",
  },
  "life-happened": {
    title: "Anchor it to a routine",
    detail: "Attach your practice to something you already do daily (coffee, commute, wind-down) so it rides along.",
    duration: "15 min",
  },
  "no-community": {
    title: "Find one other person",
    detail: "Join a single online group or message one friend. You don't need a crowd — just someone to share with.",
    duration: "10 min",
  },
};

function buildPlan({ hobby, skillLevel, stopReasons }: RecoveryPlanInput): RecoveryPlan {
  const framing = SKILL_FRAMING[skillLevel];

  const steps: RecoveryStep[] = [SKILL_FIRST_STEP[skillLevel]];

  // Add up to two remedies tailored to why they stopped.
  for (const reason of stopReasons.slice(0, 2)) {
    const remedy = REASON_REMEDY[reason.id];
    if (remedy) steps.push(remedy);
  }

  // Always close with a momentum step.
  steps.push({
    title: "Lock in the next one",
    detail: `Before you stop, decide exactly when your next ${hobby.label.toLowerCase()} session happens. A plan beats motivation.`,
    duration: "2 min",
  });

  const reasonText =
    stopReasons.length > 0
      ? ` Last time, ${stopReasons.map((r) => r.label.toLowerCase()).join(" and ")} got in the way — this plan works around that.`
      : "";

  return {
    headline: `Your ${hobby.label} comeback`,
    intro: `A gentle re-entry plan for ${framing}.${reasonText}`,
    steps,
    encouragement: "You already did the hardest part — deciding to come back. Take it one small step at a time.",
  };
}

export async function generateRecoveryPlan(
  input: RecoveryPlanInput
): Promise<RecoveryPlan> {
  // Simulated latency so the UI can show a "generating" state. Replace this
  // whole function body with the real Foundry call when ready.
  await new Promise((resolve) => setTimeout(resolve, 900));
  return buildPlan(input);
}
