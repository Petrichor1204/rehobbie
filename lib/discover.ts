import {
  DiscoverHobbiesInput,
  DiscoverHobbiesResult,
  DiscoverySuggestion,
} from "@/types";

const FALLBACK_HOOKS: Record<string, { hook: string; emoji: string; appeal: string }> = {
  gardening: { hook: "grow something alive", emoji: "🌱", appeal: "quiet, hands-on, zero pressure" },
  cooking:   { hook: "make something tasty", emoji: "🍳", appeal: "instant reward every session" },
  music:     { hook: "play your first chord", emoji: "🎸", appeal: "creative without needing skill" },
  singing:   { hook: "find your voice", emoji: "🎤", appeal: "free, expressive, always with you" },
  karate:    { hook: "move with purpose", emoji: "🥋", appeal: "body + mind in one practice" },
  reading:   { hook: "escape somewhere new", emoji: "📖", appeal: "zero setup, infinite worlds" },
  photography: { hook: "see differently", emoji: "📷", appeal: "your phone is enough to start" },
  painting:  { hook: "colour your world", emoji: "🎨", appeal: "messy is allowed here" },
  drawing:   { hook: "sketch what's around", emoji: "✏️", appeal: "pencil + paper, that's it" },
  writing:   { hook: "put words to paper", emoji: "✍️", appeal: "private, portable, yours alone" },
};

function buildFallback(input: DiscoverHobbiesInput): DiscoverHobbiesResult {
  const triedIds = new Set(input.triedHobbies.map((h) => h.id));
  if (input.rejectedHobby) triedIds.add(input.rejectedHobby.id);

  const picks = input.catalog
    .filter((h) => !triedIds.has(h.id))
    .slice(0, 4)
    .map((h) => {
      const fb = FALLBACK_HOOKS[h.id] ?? {
        hook: `try ${h.label.toLowerCase()}`,
        emoji: "✨",
        appeal: "a fresh start awaits",
      };
      return { hobbyId: h.id, ...fb } satisfies DiscoverySuggestion;
    });

  return {
    headline: "something new awaits",
    suggestions: picks,
  };
}

function isValidResult(data: unknown): data is DiscoverHobbiesResult {
  if (!data || typeof data !== "object") return false;
  const d = data as Partial<DiscoverHobbiesResult>;
  if (typeof d.headline !== "string" || !Array.isArray(d.suggestions)) return false;
  return d.suggestions.every(
    (s) =>
      s &&
      typeof s.hobbyId === "string" &&
      typeof s.hook === "string" &&
      typeof s.emoji === "string" &&
      typeof s.appeal === "string"
  );
}

export async function discoverHobbies(
  input: DiscoverHobbiesInput
): Promise<DiscoverHobbiesResult> {
  try {
    const res = await fetch("/api/discover-hobbies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const data = await res.json();
      if (isValidResult(data)) return data;
    }
  } catch {
    // fall through
  }

  await new Promise((r) => setTimeout(r, 400));
  return buildFallback(input);
}
