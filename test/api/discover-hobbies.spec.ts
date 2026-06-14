import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/discover-hobbies/route";
import { discoverInput } from "../helpers/fixtures";

const { callAiChatMock } = vi.hoisted(() => ({
  callAiChatMock: vi.fn(),
}));

vi.mock("@/lib/ai-provider", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/ai-provider")>();
  return { ...actual, callAiChat: callAiChatMock };
});

describe("POST /api/discover-hobbies", () => {
  beforeEach(() => {
    callAiChatMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("returns 400 when catalog is empty", async () => {
    const res = await POST(
      new Request("http://localhost/api/discover-hobbies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...discoverInput, catalog: [] }),
      }),
    );
    expect(res.status).toBe(400);
  });

  test("returns 501 when AI is not configured", async () => {
    callAiChatMock.mockResolvedValue(null);
    const res = await POST(
      new Request("http://localhost/api/discover-hobbies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discoverInput),
      }),
    );
    expect(res.status).toBe(501);
  });

  test("filters suggestions to catalog ids and excludes tried hobbies", async () => {
    callAiChatMock.mockResolvedValue(
      JSON.stringify({
        headline: "fresh picks",
        suggestions: [
          { hobbyId: "gardening", hook: "grow", emoji: "🌱", appeal: "calm start" },
          { hobbyId: "painting", hook: "old", emoji: "🎨", appeal: "already tried" },
          { hobbyId: "unknown", hook: "nope", emoji: "❌", appeal: "not in catalog" },
        ],
      }),
    );

    const res = await POST(
      new Request("http://localhost/api/discover-hobbies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discoverInput),
      }),
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.headline).toBe("fresh picks");
    expect(body.suggestions).toHaveLength(1);
    expect(body.suggestions[0].hobbyId).toBe("gardening");
  });

  test("returns 502 when all suggestions are filtered out", async () => {
    callAiChatMock.mockResolvedValue(
      JSON.stringify({
        headline: "nothing valid",
        suggestions: [
          { hobbyId: "painting", hook: "old", emoji: "🎨", appeal: "tried" },
        ],
      }),
    );

    const res = await POST(
      new Request("http://localhost/api/discover-hobbies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discoverInput),
      }),
    );

    expect(res.status).toBe(502);
  });
});
