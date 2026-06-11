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

export type OnboardingState = {
  selectedHobbies: Hobby[];
  favoriteHobby: Hobby | null;
  stopReasons: StopReason[];
  wantsToResume: boolean | null;
  skillLevel: SkillLevel | null;
};