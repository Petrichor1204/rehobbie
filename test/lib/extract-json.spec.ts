import { describe, expect, test } from "vitest";
import { extractJson } from "@/lib/ai-provider";

describe("extractJson", () => {
  test("parses raw JSON strings", () => {
    expect(extractJson('{"headline":"hello"}')).toEqual({ headline: "hello" });
  });

  test("parses fenced JSON blocks", () => {
    const text = "Here you go:\n```json\n{\"ok\":true}\n```";
    expect(extractJson(text)).toEqual({ ok: true });
  });

  test("extracts JSON embedded in prose", () => {
    const text = 'Sure! {"headline":"plan","steps":[]} is the payload.';
    expect(extractJson(text)).toEqual({ headline: "plan", steps: [] });
  });

  test("returns null for non-JSON content", () => {
    expect(extractJson("not json at all")).toBeNull();
  });
});
