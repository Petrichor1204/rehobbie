// app/api/recovery-plan/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Microsoft Foundry IQ — server-side recovery-plan generation (Step 9).
//
// Runs on the server so the Foundry key never reaches the browser. Uses the
// Azure OpenAI–compatible chat-completions surface that Azure AI Foundry exposes
// and asks for a strict JSON object matching the RecoveryPlan shape.
//
// Configure via env (see .env.local.example):
//   AZURE_FOUNDRY_ENDPOINT     e.g. https://my-resource.openai.azure.com
//   AZURE_FOUNDRY_API_KEY      the resource / deployment key
//   AZURE_FOUNDRY_DEPLOYMENT   the deployment (model) name, e.g. gpt-4o-mini
//   AZURE_FOUNDRY_API_VERSION  optional, defaults below
//
// When unconfigured it returns 501 and the client falls back to the local
// deterministic generator in lib/foundry.ts, so the dashboard always works.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { RecoveryPlan, RecoveryPlanInput } from "@/types";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are Rehobbie's encouraging comeback coach. A user is returning to a hobby they abandoned. Produce a short, warm, practical "re-entry plan".

Return ONLY a JSON object with EXACTLY this shape:
{
  "headline": string,            // ≤6 words, e.g. "Your Photography comeback"
  "intro": string,               // 1-2 sentences, references why they stopped
  "steps": [                     // 3-4 steps, ordered, easiest first
    { "title": string, "detail": string, "duration": string }  // duration like "15 min"
  ],
  "encouragement": string        // 1 warm closing sentence
}
No markdown, no commentary — JSON only.`;

function buildUserPrompt(input: RecoveryPlanInput): string {
  const reasons =
    input.stopReasons.length > 0
      ? input.stopReasons.map((r) => r.label).join(", ")
      : "not specified";
  return [
    `Hobby: ${input.hobby.label}`,
    `Current skill level: ${input.skillLevel}`,
    `Why they stopped before: ${reasons}`,
    `Write a plan that works around those obstacles and matches the skill level.`,
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
    p.steps.every(
      (s) =>
        s &&
        typeof (s as Record<string, unknown>).title === "string" &&
        typeof (s as Record<string, unknown>).detail === "string" &&
        typeof (s as Record<string, unknown>).duration === "string"
    )
  );
}

export async function POST(req: Request) {
  const endpoint = process.env.AZURE_FOUNDRY_ENDPOINT;
  const apiKey = process.env.AZURE_FOUNDRY_API_KEY;
  const deployment = process.env.AZURE_FOUNDRY_DEPLOYMENT;
  const apiVersion = process.env.AZURE_FOUNDRY_API_VERSION ?? "2024-08-01-preview";

  if (!endpoint || !apiKey || !deployment) {
    // Not configured — signal the client to use its local fallback.
    return NextResponse.json({ error: "foundry_not_configured" }, { status: 501 });
  }

  let input: RecoveryPlanInput;
  try {
    input = (await req.json()) as RecoveryPlanInput;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!input?.hobby?.label || !input?.skillLevel) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(input) },
        ],
        temperature: 0.7,
        max_tokens: 700,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[foundry] upstream error", res.status, detail.slice(0, 500));
      return NextResponse.json(
        { error: "foundry_upstream", status: res.status },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "foundry_empty" }, { status: 502 });
    }

    const parsed = JSON.parse(content);
    if (!isValidPlan(parsed)) {
      console.error("[foundry] unexpected plan shape", content.slice(0, 500));
      return NextResponse.json({ error: "foundry_bad_shape" }, { status: 502 });
    }

    return NextResponse.json(parsed satisfies RecoveryPlan);
  } catch (err) {
    console.error("[foundry] request failed", err);
    return NextResponse.json({ error: "foundry_failed" }, { status: 502 });
  }
}
