import { NextResponse } from "next/server";
import { callAiChat, extractJson } from "@/lib/ai-provider";
import type { FindPeersInput, FindPeersResult } from "@/types";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are Rehobbie's community matcher. The user stopped their hobby because they had NO ONE to do it with. Your job is to find real places online where people at THEIR EXACT SKILL LEVEL gather for THIS hobby.

Suggest REAL, well-known communities (Reddit subs, Discord servers, Meetup groups, Facebook groups, forums). Prefer active, welcoming spaces matched to skill level:
- novice → beginner-friendly, "learn" or "newbie" spaces
- getting-good → practice partners, critique groups open to intermediates
- advanced → skill-specific critique, portfolio/workshop groups
- expert → masterclass communities, professional networks
- just-for-fun → casual, no-pressure social groups

Return ONLY JSON:
{
  "headline": string,     // ≤5 words, e.g. "novice painters near you"
  "matches": [            // 3-4 matches, best first
    {
      "name": string,       // community/group name
      "platform": string,   // Reddit | Discord | Meetup | Facebook | Forum
      "hook": string,       // ≤8 words — why others at their level go here
      "emoji": string,      // single emoji
      "url": string         // real URL if you know it, else best search URL
    }
  ]
}
Keep copy SHORT — visual app, minimal words. JSON only.`;

function buildUserPrompt(input: FindPeersInput): string {
  return [
    `Hobby: ${input.hobby.label}`,
    `Their skill level: ${input.skillLevel}`,
    `They stopped because: no one to do it with`,
    `Find communities where ${input.skillLevel}-level ${input.hobby.label.toLowerCase()} people actually hang out and connect.`,
  ].join("\n");
}

function isValidResult(data: unknown): data is FindPeersResult {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.headline === "string" &&
    Array.isArray(d.matches) &&
    d.matches.length > 0 &&
    (d.matches as Record<string, unknown>[]).every(
      (m) =>
        typeof m.name === "string" &&
        typeof m.platform === "string" &&
        typeof m.hook === "string" &&
        typeof m.emoji === "string"
    )
  );
}

export async function POST(req: Request) {
  let input: FindPeersInput;
  try {
    input = (await req.json()) as FindPeersInput;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!input?.hobby?.label || !input?.skillLevel) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const content = await callAiChat(
    [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(input) },
    ],
    { maxTokens: 550, temperature: 0.75 }
  );

  if (!content) {
    return NextResponse.json({ error: "ai_not_configured" }, { status: 501 });
  }

  const parsed = extractJson(content);
  if (!isValidResult(parsed)) {
    console.error("[ai] bad peers shape", content.slice(0, 500));
    return NextResponse.json({ error: "ai_bad_shape" }, { status: 502 });
  }

  return NextResponse.json(parsed satisfies FindPeersResult);
}
