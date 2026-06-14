import { FindPeersInput, FindPeersResult, PeerMatch, SkillLevel } from "@/types";
import { getResources } from "@/lib/resources";

const LEVEL_LABEL: Record<SkillLevel, string> = {
  novice: "just starting out",
  "getting-good": "past the basics",
  advanced: "confident & capable",
  expert: "deep experience",
  "just-for-fun": "here for the joy",
};

const PLATFORM_EMOJI: Record<string, string> = {
  Reddit: "💬",
  Discord: "🎮",
  Meetup: "📍",
  Facebook: "👥",
  default: "🤝",
};

function buildFallback({ hobby, skillLevel }: FindPeersInput): FindPeersResult {
  const resources = getResources(hobby.id, hobby.label);
  const level = LEVEL_LABEL[skillLevel];

  const matches: PeerMatch[] = resources.communities.slice(0, 3).map((c, i) => ({
    name: c.title,
    platform: c.by,
    hook: c.note ?? `${level} — jump right in`,
    emoji: PLATFORM_EMOJI[c.by] ?? PLATFORM_EMOJI.default,
    url: c.url,
  }));

  // Pad with a generic level-matched suggestion if we have fewer than 2.
  if (matches.length < 2) {
    matches.push({
      name: `${hobby.label} beginners`,
      platform: "Discord",
      hook: `others ${level} — say hi`,
      emoji: "🎮",
      url: `https://discord.com/search?query=${encodeURIComponent(hobby.label + " " + skillLevel)}`,
    });
  }

  return {
    headline: "your people await",
    matches,
  };
}

function isValidResult(data: unknown): data is FindPeersResult {
  if (!data || typeof data !== "object") return false;
  const d = data as Partial<FindPeersResult>;
  if (typeof d.headline !== "string" || !Array.isArray(d.matches)) return false;
  return d.matches.every(
    (m) =>
      m &&
      typeof m.name === "string" &&
      typeof m.platform === "string" &&
      typeof m.hook === "string" &&
      typeof m.emoji === "string"
  );
}

export async function findPeers(input: FindPeersInput): Promise<FindPeersResult> {
  try {
    const res = await fetch("/api/find-peers", {
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
