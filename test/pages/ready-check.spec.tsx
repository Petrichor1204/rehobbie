/**
 * @vitest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { push, saveSession } = vi.hoisted(() => ({
  push: vi.fn(),
  saveSession: vi.fn(),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) =>
      React.createElement("div", props, children),
    p: ({ children, ...props }: React.ComponentProps<"p">) =>
      React.createElement("p", props, children),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, back: vi.fn() }),
}));

vi.mock("@/lib/supabase", () => ({ saveSession }));

vi.mock("@/components/onboarding/SwipeCard", () => ({
  SwipeCard: ({ onSwipe }: { onSwipe: (value: boolean) => void }) =>
    React.createElement(
      "div",
      {},
      React.createElement("button", { type: "button", onClick: () => onSwipe(true) }, "YES"),
      React.createElement("button", { type: "button", onClick: () => onSwipe(false) }, "NO"),
    ),
}));

vi.mock("@/components/onboarding/OnboardingShell", () => ({
  OnboardingShell: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", {}, children),
}));

import ReadyCheckPage from "@/app/ready-check/page";
import { useOnboardingStore } from "@/store/onboarding";
import { gardening, noTimeReason } from "../helpers/fixtures";

describe("ReadyCheckPage", () => {
  beforeEach(() => {
    push.mockReset();
    saveSession.mockReset();
    useOnboardingStore.getState().reset();
    useOnboardingStore.setState({
      selectedHobbies: [gardening],
      favoriteHobby: gardening,
      stopReasons: [noTimeReason],
      skillLevel: "novice",
    });
  });

  test("renders swipe prompt and chosen hobby", () => {
    render(<ReadyCheckPage />);
    expect(screen.getByText(/swipe or tap to decide/i)).toBeInTheDocument();
    expect(screen.getByText(/gardening/i)).toBeInTheDocument();
  });

  test("swipe yes saves session and routes to dashboard", () => {
    render(<ReadyCheckPage />);
    fireEvent.click(screen.getByText("YES"));

    expect(useOnboardingStore.getState().wantsToResume).toBe(true);
    expect(saveSession).toHaveBeenCalledWith({
      selected_hobbies: ["gardening"],
      favorite_hobby: "gardening",
      stop_reasons: ["no-time"],
      wants_to_resume: true,
      skill_level: "novice",
    });
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  test("swipe no saves session and routes to explore", () => {
    render(<ReadyCheckPage />);
    fireEvent.click(screen.getByText("NO"));

    expect(useOnboardingStore.getState().wantsToResume).toBe(false);
    expect(saveSession).toHaveBeenCalledWith(
      expect.objectContaining({ wants_to_resume: false }),
    );
    expect(push).toHaveBeenCalledWith("/explore");
  });
});
