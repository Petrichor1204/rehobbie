import { beforeEach, describe, expect, test } from "vitest";
import { useOnboardingStore } from "@/store/onboarding";
import { gardening, painting, noTimeReason, noCommunityReason } from "../helpers/fixtures";

describe("onboarding store", () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
  });

  test("toggleHobby adds and removes hobbies", () => {
    const { toggleHobby } = useOnboardingStore.getState();
    toggleHobby(gardening);
    expect(useOnboardingStore.getState().selectedHobbies).toEqual([gardening]);
    toggleHobby(painting);
    expect(useOnboardingStore.getState().selectedHobbies).toHaveLength(2);
    toggleHobby(gardening);
    expect(useOnboardingStore.getState().selectedHobbies).toEqual([painting]);
  });

  test("setWantsToResume tracks swipe yes vs no", () => {
    useOnboardingStore.getState().setWantsToResume(true);
    expect(useOnboardingStore.getState().wantsToResume).toBe(true);
    useOnboardingStore.getState().setWantsToResume(false);
    expect(useOnboardingStore.getState().wantsToResume).toBe(false);
  });

  test("startDiscovery resets journey and flags discovery mode", () => {
    useOnboardingStore.setState({
      selectedHobbies: [painting],
      favoriteHobby: painting,
      stopReasons: [noTimeReason],
      wantsToResume: true,
      skillLevel: "advanced",
      isDiscovery: false,
    });

    useOnboardingStore.getState().startDiscovery(gardening);

    const state = useOnboardingStore.getState();
    expect(state.isDiscovery).toBe(true);
    expect(state.wantsToResume).toBe(false);
    expect(state.favoriteHobby).toEqual(gardening);
    expect(state.selectedHobbies).toEqual([gardening]);
    expect(state.stopReasons).toEqual([]);
    expect(state.skillLevel).toBeNull();
  });

  test("toggleStopReason and setSkillLevel update selections", () => {
    const store = useOnboardingStore.getState();
    store.toggleStopReason(noTimeReason);
    store.toggleStopReason(noCommunityReason);
    expect(useOnboardingStore.getState().stopReasons).toHaveLength(2);
    store.toggleStopReason(noTimeReason);
    expect(useOnboardingStore.getState().stopReasons).toEqual([noCommunityReason]);
    store.setSkillLevel("getting-good");
    expect(useOnboardingStore.getState().skillLevel).toBe("getting-good");
  });

  test("reset returns initial onboarding state", () => {
    useOnboardingStore.setState({
      selectedHobbies: [gardening],
      favoriteHobby: gardening,
      stopReasons: [noTimeReason],
      wantsToResume: true,
      skillLevel: "expert",
      isDiscovery: true,
    });

    useOnboardingStore.getState().reset();

    const state = useOnboardingStore.getState();
    expect(state.selectedHobbies).toEqual([]);
    expect(state.favoriteHobby).toBeNull();
    expect(state.stopReasons).toEqual([]);
    expect(state.wantsToResume).toBeNull();
    expect(state.skillLevel).toBeNull();
    expect(state.isDiscovery).toBe(false);
  });
});
