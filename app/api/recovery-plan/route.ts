import { NextResponse } from "next/server";
import { callAiChat, extractJson } from "@/lib/ai-provider";
import type { RecoveryPlan, RecoveryPlanInput } from "@/types";

export const runtime = "nodejs";

const COMEBACK_PROMPT = `You are Rehobbie's comeback coach. A user is returning to a hobby they abandoned.

Return ONLY JSON:
{
  "headline": string,     // ≤4 words
  "intro": string,        // ≤12 words total
  "steps": [              // 3-4 steps
    { "title": string, "detail": string, "duration": string }
  ],
  "encouragement": string // ≤10 words
}
Keep every string SHORT — this displays on visual swipe cards, not paragraphs. No markdown.`;

const DISCOVERY_PROMPT = `You are Rehobbie's discovery coach. A user is trying a hobby for the FIRST TIME — they've never done it before.

Return ONLY JSON:
{
  "headline": string,     // ≤4 words, e.g. "Your Gardening debut"
  "intro": string,        // ≤12 words — exciting, zero pressure
  "steps": [              // 3-4 tiny first steps for a complete beginner
    { "title": string, "detail": string, "duration": string }
  ],
  "encouragement": string // ≤10 words
}
Keep every string SHORT — visual swipe cards, not paragraphs. No markdown.`;

function buildUserPrompt(input: RecoveryPlanInput): string {
  const mode = input.mode ?? "comeback";
  const reasons =
    input.stopReasons.length > 0
      ? input.stopReasons.map((r) => r.label).join(", ")
      : "not specified";

  if (mode === "discovery") {
    return [
      `Brand-new hobby: ${input.hobby.label}`,
      `Skill level: ${input.skillLevel}`,
      `They previously tried other hobbies but want something fresh.`,
      `Write a fun, low-pressure first-time starter plan.`,
    ].join("\n");
  }

  return [
    `Hobby: ${input.hobby.label}`,
    `Skill level: ${input.skillLevel}`,
    `Why they stopped: ${reasons}`,
    `Write a comeback plan that works around those obstacles.`,
  ].join("\n");
}

function isValidPlan(plan: unknown): plan is RecoveryPlan {
  if (!plan || typeof plan !== "object") return false;
  const p = plan as Record<string, unknown>;
  return (
    typeof p.headline === "string" &&
    typeof p.intro === "string" &&
    typeof p.encouragement === "string" &&
    Array.isArray(p.steps) &&
    p.steps.length > 0 &&
    (p.steps as Record<string, unknown>[]).every(
      (s) =>
        typeof s.title === "string" &&
        typeof s.detail === "string" &&
        typeof s.duration === "string"
    )
  );
}

export async function POST(req: Request) {
  let input: RecoveryPlanInput;
  try {
    input = (await req.json()) as RecoveryPlanInput;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!input?.hobby?.label || !input?.skillLevel) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const mode = input.mode ?? "comeback";
  const systemPrompt = mode === "discovery" ? DISCOVERY_PROMPT : COMEBACK_PROMPT;

  const content = await callAiChat(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: buildUserPrompt(input) },
    ],
    { maxTokens: 650, temperature: 0.75 }
  );

  if (!content) {
    return NextResponse.json({ error: "ai_not_configured" }, { status: 501 });
  }

  const parsed = extractJson(content);
  if (!isValidPlan(parsed)) {
    console.error("[ai] unexpected plan shape", content.slice(0, 500));
    return NextResponse.json({ error: "ai_bad_shape" }, { status: 502 });
  }

  return NextResponse.json(parsed satisfies RecoveryPlan);
}
