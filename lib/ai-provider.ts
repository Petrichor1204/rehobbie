// lib/ai-provider.ts — shared Microsoft Foundry / GitHub Models caller (server-only).

export type AiProviderRequest = {
  url: string;
  headers: Record<string, string>;
  model?: string;
  jsonMode: boolean;
};

const GITHUB_MODELS_URL = "https://models.github.ai/inference/chat/completions";
const DEFAULT_GITHUB_MODEL = "openai/gpt-4o-mini";
const DEFAULT_FOUNDRY_API_VERSION = "2024-05-01-preview";
const DEFAULT_AZURE_OPENAI_API_VERSION = "2024-08-01-preview";

export function resolveAiProvider(): AiProviderRequest | null {
  const rawEndpoint = process.env.AZURE_FOUNDRY_ENDPOINT;
  const apiKey = process.env.AZURE_FOUNDRY_API_KEY;
  const deployment = process.env.AZURE_FOUNDRY_DEPLOYMENT;

  if (rawEndpoint && apiKey && deployment) {
    const jsonMode = (process.env.AZURE_FOUNDRY_JSON_MODE ?? "true") !== "false";
    const headers = { "Content-Type": "application/json", "api-key": apiKey };

    let origin: string;
    try {
      origin = new URL(rawEndpoint).origin;
    } catch {
      origin = rawEndpoint.replace(/\/+$/, "");
    }

    if (/\.services\.ai\.azure\.com/i.test(rawEndpoint)) {
      const apiVersion =
        process.env.AZURE_FOUNDRY_API_VERSION ?? DEFAULT_FOUNDRY_API_VERSION;
      return {
        url: `${origin}/models/chat/completions?api-version=${apiVersion}`,
        headers,
        model: deployment,
        jsonMode,
      };
    }

    const apiVersion =
      process.env.AZURE_FOUNDRY_API_VERSION ?? DEFAULT_AZURE_OPENAI_API_VERSION;
    return {
      url: `${origin}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
      headers,
      jsonMode,
    };
  }

  const githubToken = process.env.GITHUB_MODELS_TOKEN;
  if (githubToken) {
    return {
      url: GITHUB_MODELS_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubToken}`,
      },
      model: process.env.GITHUB_MODELS_MODEL ?? DEFAULT_GITHUB_MODEL,
      jsonMode: true,
    };
  }

  return null;
}

export function extractJson(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    // keep trying
  }
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]);
    } catch {
      // fall through
    }
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      // fall through
    }
  }
  return null;
}

type ChatMessage = { role: "system" | "user"; content: string };

export async function callAiChat(
  messages: ChatMessage[],
  opts?: { maxTokens?: number; temperature?: number }
): Promise<string | null> {
  const provider = resolveAiProvider();
  if (!provider) return null;

  const res = await fetch(provider.url, {
    method: "POST",
    headers: provider.headers,
    body: JSON.stringify({
      ...(provider.model ? { model: provider.model } : {}),
      messages,
      temperature: opts?.temperature ?? 0.7,
      max_tokens: opts?.maxTokens ?? 700,
      ...(provider.jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("[ai] upstream error", res.status, detail.slice(0, 500));
    return null;
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? null;
}
