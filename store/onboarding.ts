// store/onboarding.ts
// ─────────────────────────────────────────────────────────────────────────────
// Global state shared across all onboarding steps.
// Uses Zustand. Install with: npm install zustand
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { Hobby, StopReason, SkillLevel } from "@/types";

type OnboardingStore = {
  selectedHobbies: Hobby[];
  favoriteHobby: Hobby | null;
  stopReasons: StopReason[];
  wantsToResume: boolean | null;
  skillLevel: SkillLevel | null;
  isDiscovery: boolean;

  // Actions
  setSelectedHobbies: (hobbies: Hobby[]) => void;
  toggleHobby: (hobby: Hobby) => void;
  setFavoriteHobby: (hobby: Hobby) => void;
  toggleStopReason: (reason: StopReason) => void;
  setWantsToResume: (val: boolean) => void;
  setSkillLevel: (level: SkillLevel) => void;
  reset: () => void;
  // Swipe-no path: pick a brand-new hobby and jump to dashboard.
  startDiscovery: (hobby: Hobby) => void;
};

const initialState = {
  selectedHobbies: [],
  favoriteHobby: null,
  stopReasons: [],
  wantsToResume: null,
  skillLevel: null,
  isDiscovery: false,
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...initialState,

  setSelectedHobbies: (hobbies) => set({ selectedHobbies: hobbies }),

  toggleHobby: (hobby) =>
    set((state) => {
      const exists = state.selectedHobbies.find((h) => h.id === hobby.id);
      return {
        selectedHobbies: exists
          ? state.selectedHobbies.filter((h) => h.id !== hobby.id)
          : [...state.selectedHobbies, hobby],
      };
    }),

  setFavoriteHobby: (hobby) => set({ favoriteHobby: hobby }),

  toggleStopReason: (reason) =>
    set((state) => {
      const exists = state.stopReasons.find((r) => r.id === reason.id);
      return {
        stopReasons: exists
          ? state.stopReasons.filter((r) => r.id !== reason.id)
          : [...state.stopReasons, reason],
      };
    }),

  setWantsToResume: (val) => set({ wantsToResume: val }),
  setSkillLevel: (level) => set({ skillLevel: level }),
  reset: () => set(initialState),

  startDiscovery: (hobby) =>
    set({
      ...initialState,
      selectedHobbies: [hobby],
      favoriteHobby: hobby,
      wantsToResume: false,
      isDiscovery: true,
    }),
}));