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

export type RecoveryPlanInput = {
  hobby: Hobby;
  skillLevel: SkillLevel;
  stopReasons: StopReason[];
};