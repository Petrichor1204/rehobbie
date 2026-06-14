import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/recovery-plan/route";
import {
  recoveryPlanInput,
  validRecoveryPlan,
} from "../helpers/fixtures";

const { callAiChatMock } = vi.hoisted(() => ({
  callAiChatMock: vi.fn(),
}));

vi.mock("@/lib/ai-provider", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/ai-provider")>();
  return { ...actual, callAiChat: callAiChatMock };
});

describe("POST /api/recovery-plan", () => {
  beforeEach(() => {
    callAiChatMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("returns 400 for invalid JSON body", async () => {
    const res = await POST(new Request("http://localhost/api/recovery-plan", { method: "POST", body: "{" }));
    expect(res.status).toBe(400);
  });

  test("returns 400 when required fields are missing", async () => {
    const res = await POST(
      new Request("http://localhost/api/recovery-plan", {
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
      new Request("http://localhost/api/recovery-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recoveryPlanInput),
      }),
    );
    expect(res.status).toBe(501);
    expect(await res.json()).toEqual({ error: "ai_not_configured" });
  });

  test("returns 502 when AI response shape is invalid", async () => {
    callAiChatMock.mockResolvedValue(JSON.stringify({ headline: "only headline" }));
    const res = await POST(
      new Request("http://localhost/api/recovery-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recoveryPlanInput),
      }),
    );
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "ai_bad_shape" });
  });

  test("returns a valid recovery plan from AI", async () => {
    callAiChatMock.mockResolvedValue(JSON.stringify(validRecoveryPlan));
    const res = await POST(
      new Request("http://localhost/api/recovery-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recoveryPlanInput),
      }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(validRecoveryPlan);
    expect(callAiChatMock).toHaveBeenCalledOnce();
  });
});
