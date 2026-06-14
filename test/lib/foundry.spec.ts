import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { generateRecoveryPlan } from "@/lib/foundry";
import { recoveryPlanInput, validRecoveryPlan } from "../helpers/fixtures";

describe("generateRecoveryPlan", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test("returns API plan when route responds with valid JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(validRecoveryPlan),
        }),
      ),
    );

    const planPromise = generateRecoveryPlan(recoveryPlanInput);
    await vi.runAllTimersAsync();
    const plan = await planPromise;

    expect(plan).toEqual(validRecoveryPlan);
  });

  test("falls back to local comeback plan when API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: false, status: 501 })),
    );

    const planPromise = generateRecoveryPlan(recoveryPlanInput);
    await vi.runAllTimersAsync();
    const plan = await planPromise;

    expect(plan.headline).toContain("Gardening");
    expect(plan.steps.length).toBeGreaterThan(0);
    expect(plan.encouragement).toBeTruthy();
  });

  test("falls back to discovery plan shape in discovery mode", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: false, status: 502 })),
    );

    const planPromise = generateRecoveryPlan({
      ...recoveryPlanInput,
      mode: "discovery",
    });
    await vi.runAllTimersAsync();
    const plan = await planPromise;

    expect(plan.headline).toContain("Try Gardening");
    expect(plan.steps.some((step) => step.title.toLowerCase().includes("tiny"))).toBe(true);
  });
});
