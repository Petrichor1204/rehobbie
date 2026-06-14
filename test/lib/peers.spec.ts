import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { findPeers } from "@/lib/peers";
import { findPeersInput } from "../helpers/fixtures";

describe("findPeers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test("returns API matches when route responds with valid JSON", async () => {
    const payload = {
      headline: "your people await",
      matches: [
        {
          name: "Garden Club",
          platform: "Meetup",
          hook: "novice friendly",
          emoji: "📍",
        },
      ],
    };

    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(payload),
        }),
      ),
    );

    const resultPromise = findPeers(findPeersInput);
    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(result).toEqual(payload);
  });

  test("falls back to resource-based communities when API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: false, status: 501 })),
    );

    const resultPromise = findPeers(findPeersInput);
    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(result.headline).toBe("your people await");
    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.matches[0].name).toBeTruthy();
    expect(result.matches[0].platform).toBeTruthy();
  });
});
