import type {
  DiscoverHobbiesInput,
  FindPeersInput,
  RecoveryPlan,
  RecoveryPlanInput,
} from "@/types";

export const gardening = {
  id: "gardening",
  label: "Gardening",
  image: "/images/gardening.png",
};

export const painting = {
  id: "painting",
  label: "Painting",
  image: "/images/painting_select.png",
};

export const noTimeReason = { id: "no-time", label: "Didn't have time" };
export const noCommunityReason = { id: "no-community", label: "No one to do it with" };

export const recoveryPlanInput: RecoveryPlanInput = {
  hobby: gardening,
  skillLevel: "novice",
  stopReasons: [noTimeReason],
  mode: "comeback",
};

export const validRecoveryPlan: RecoveryPlan = {
  headline: "Gardening comeback",
  intro: "Small steps back in.",
  steps: [{ title: "Water one plant", detail: "Start tiny.", duration: "10 min" }],
  encouragement: "You showed up.",
};

export const discoverInput: DiscoverHobbiesInput = {
  triedHobbies: [{ id: "painting", label: "Painting" }],
  rejectedHobby: { id: "photography", label: "Photography" },
  stopReasons: [{ id: "no-community", label: "No one to do it with" }],
  catalog: [
    { id: "gardening", label: "Gardening" },
    { id: "cooking", label: "Cooking" },
    { id: "music", label: "Music" },
  ],
};

export const findPeersInput: FindPeersInput = {
  hobby: gardening,
  skillLevel: "novice",
};
