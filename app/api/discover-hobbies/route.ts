import { NextResponse } from "next/server";
import { callAiChat, extractJson } from "@/lib/ai-provider";
import type { DiscoverHobbiesInput, DiscoverHobbiesResult } from "@/types";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are Rehobbie's hobby discovery curator. The user said NO to resuming an old hobby — they want something BRAND NEW they've never tried before.

Your job: pick the most appealing NEW hobbies from the catalog and write ultra-short, visual, punchy copy that makes each one feel exciting and personal.

Rules:
- ONLY use hobby IDs from the provided catalog. Never invent hobbies.
- Exclude anything they already tried or rejected.
- Write for a visual, word-light app — every string must be SHORT.
- Frame these as first-time discoveries, NOT comebacks.

Return ONLY JSON:
{
  "headline": string,        // ≤5 words, e.g. "meet your next obsession"
  "suggestions": [           // 3-4 items, best matches first
    {
      "hobbyId": string,     // must match a catalog id exactly
      "hook": string,        // ≤5 words, punchy headline
      "emoji": string,       // single emoji capturing the vibe
      "appeal": string       // ≤8 words — why THIS person would love it
    }
  ]
}`;

function buildUserPrompt(input: DiscoverHobbiesInput): string {
  const tried = input.triedHobbies.map((h) => h.label).join(", ") || "none";
  const rejected = input.rejectedHobby?.label ?? "none";
  const reasons =
    input.stopReasons.map((r) => r.label).join(", ") || "not specified";
  const catalog = input.catalog.map((h) => `${h.id}: ${h.label}`).join("\n");

  return [
    `Hobbies they USED TO do (exclude these): ${tried}`,
    `Hobby they just rejected resuming: ${rejected}`,
    `Why old hobbies didn't work: ${reasons}`,
    "",
    "Available NEW hobbies (pick from these ONLY):",
    catalog,
    "",
    "Suggest 3-4 brand-new hobbies they'd never tried. Make each feel fresh, low-pressure, and visually exciting.",
  ].join("\n");
}

function isValidResult(data: unknown): data is DiscoverHobbiesResult {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.headline === "string" &&
    Array.isArray(d.suggestions) &&
    d.suggestions.length > 0 &&
    (d.suggestions as Record<string, unknown>[]).every(
      (s) =>
        typeof s.hobbyId === "string" &&
        typeof s.hook === "string" &&
        typeof s.emoji === "string" &&
        typeof s.appeal === "string"
    )
  );
}

export async function POST(req: Request) {
  let input: DiscoverHobbiesInput;
  try {
    input = (await req.json()) as DiscoverHobbiesInput;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!input?.catalog?.length) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const content = await callAiChat(
    [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(input) },
    ],
    { maxTokens: 600, temperature: 0.85 }
  );

  if (!content) {
    return NextResponse.json({ error: "ai_not_configured" }, { status: 501 });
  }

  const parsed = extractJson(content);
  if (!isValidResult(parsed)) {
    console.error("[ai] bad discover shape", content.slice(0, 500));
    return NextResponse.json({ error: "ai_bad_shape" }, { status: 502 });
  }

  // Filter to catalog ids only (model safety).
  const validIds = new Set(input.catalog.map((h) => h.id));
  const triedIds = new Set([
    ...input.triedHobbies.map((h) => h.id),
    ...(input.rejectedHobby ? [input.rejectedHobby.id] : []),
  ]);
  const suggestions = parsed.suggestions.filter(
    (s) => validIds.has(s.hobbyId) && !triedIds.has(s.hobbyId)
  );

  if (suggestions.length === 0) {
    return NextResponse.json({ error: "ai_bad_shape" }, { status: 502 });
  }

  return NextResponse.json({ headline: parsed.headline, suggestions });
}
