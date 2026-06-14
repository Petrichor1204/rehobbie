import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/find-peers/route";
import { findPeersInput } from "../helpers/fixtures";

const { callAiChatMock } = vi.hoisted(() => ({
  callAiChatMock: vi.fn(),
}));

vi.mock("@/lib/ai-provider", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/ai-provider")>();
  return { ...actual, callAiChat: callAiChatMock };
});

describe("POST /api/find-peers", () => {
  beforeEach(() => {
    callAiChatMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("returns 400 when hobby or skill level is missing", async () => {
    const res = await POST(
      new Request("http://localhost/api/find-peers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hobby: { label: "Gardening" } }),
      }),
    );
    expect(res.status).toBe(400);
  });

  test("returns 501 when AI is not configured", async () => {
    callAiChatMock.mockResolvedValue(null);
    const res = await POST(
      new Request("http://localhost/api/find-peers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(findPeersInput),
      }),
    );
    expect(res.status).toBe(501);
  });

  test("returns peer matches from AI", async () => {
    const payload = {
      headline: "novice gardeners",
      matches: [
        {
          name: "r/gardening",
          platform: "Reddit",
          hook: "beginner friendly",
          emoji: "🌱",
          url: "https://reddit.com/r/gardening",
        },
      ],
    };
    callAiChatMock.mockResolvedValue(JSON.stringify(payload));

    const res = await POST(
      new Request("http://localhost/api/find-peers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(findPeersInput),
      }),
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(payload);
  });

  test("returns 502 for malformed AI payload", async () => {
    callAiChatMock.mockResolvedValue(JSON.stringify({ headline: "missing matches" }));
    const res = await POST(
      new Request("http://localhost/api/find-peers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(findPeersInput),
      }),
    );
    expect(res.status).toBe(502);
  });
});
