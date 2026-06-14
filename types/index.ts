export type Hobby = {
  id: string;
  label: string;
  image: string; // path in /public folder e.g. "/images/photography.png"
};

export type StopReason = {
  id: string;
  label: string;
};

export type SkillLevel = "novice" | "getting-good" | "advanced" | "expert" | "just-for-fun";

export type SkillLevelOption = {
  id: SkillLevel;
  label: string;
  blurb: string;
};

export type OnboardingState = {
  selectedHobbies: Hobby[];
  favoriteHobby: Hobby | null;
  stopReasons: StopReason[];
  wantsToResume: boolean | null;
  skillLevel: SkillLevel | null;
  isDiscovery: boolean;
};

// ── Resources (Step 5c) ───────────────────────────────────────────────────────
export type ResourceKind = "book" | "video" | "community";

export type Resource = {
  kind: ResourceKind;
  title: string;
  by: string; // author, channel, or platform
  note?: string;
  url?: string;
};

export type HobbyResources = {
  books: Resource[];
  videos: Resource[];
  communities: Resource[];
};

// ── AI recovery plan (Step 5b — Foundry) ──────────────────────────────────────
export type RecoveryStep = {
  title: string;
  detail: string;
  duration: string; // e.g. "15 min"
};

export type RecoveryPlan = {
  headline: string;
  intro: string;
  steps: RecoveryStep[];
  encouragement: string;
};

export type PlanMode = "comeback" | "discovery";

export type RecoveryPlanInput = {
  hobby: Hobby;
  skillLevel: SkillLevel;
  stopReasons: StopReason[];
  mode?: PlanMode;
};

// ── Explore / discovery (swipe no — brand-new hobbies) ────────────────────────
export type DiscoveryCatalogItem = {
  id: string;
  label: string;
};

export type DiscoverySuggestion = {
  hobbyId: string;
  hook: string;   // punchy ≤6 words
  emoji: string;  // single emoji vibe
  appeal: string; // ≤10 words — why it fits them
};

export type DiscoverHobbiesInput = {
  triedHobbies: DiscoveryCatalogItem[];
  rejectedHobby: DiscoveryCatalogItem | null;
  stopReasons: DiscoveryCatalogItem[];
  catalog: DiscoveryCatalogItem[];
};

export type DiscoverHobbiesResult = {
  headline: string; // ≤6 words intro slide
  suggestions: DiscoverySuggestion[];
};

// ── Peer matching (no-community stop reason — Foundry IQ) ────────────────────
export type PeerMatch = {
  name: string;      // community or group name
  platform: string;  // Reddit, Discord, Meetup, etc.
  hook: string;      // ≤8 words — why it fits their level
  emoji: string;     // vibe avatar
  url?: string;
};

export type FindPeersInput = {
  hobby: { id: string; label: string };
  skillLevel: SkillLevel;
};

export type FindPeersResult = {
  headline: string;  // ≤6 words
  matches: PeerMatch[];
};