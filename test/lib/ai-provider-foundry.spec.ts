import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { resolveAiProvider } from "@/lib/ai-provider";

describe("resolveAiProvider — Foundry", () => {
  const ORIGINAL = { ...process.env };

  beforeEach(() => {
    delete process.env.GITHUB_MODELS_TOKEN;
  });

  afterEach(() => {
    Object.assign(process.env, ORIGINAL);
  });

  test("returns services.ai.azure.com models endpoint when Foundry vars set", () => {
    process.env.AZURE_FOUNDRY_ENDPOINT = "https://rehobbie.services.ai.azure.com";
    process.env.AZURE_FOUNDRY_API_KEY = "foundry-key";
    process.env.AZURE_FOUNDRY_DEPLOYMENT = "grok-4-1-fast-non-reasoning";

    const provider = resolveAiProvider();
    expect(provider?.url).toContain("/models/chat/completions");
    expect(provider?.url).toContain("api-version=");
    expect(provider?.headers["api-key"]).toBe("foundry-key");
    expect(provider?.model).toBe("grok-4-1-fast-non-reasoning");
    expect(provider?.jsonMode).toBe(true);
  });

  test("returns openai.azure.com deployment endpoint for classic Azure OpenAI", () => {
    process.env.AZURE_FOUNDRY_ENDPOINT = "https://rehobbie.openai.azure.com";
    process.env.AZURE_FOUNDRY_API_KEY = "azure-key";
    process.env.AZURE_FOUNDRY_DEPLOYMENT = "gpt-4o-mini";

    const provider = resolveAiProvider();
    expect(provider?.url).toContain("/openai/deployments/gpt-4o-mini/chat/completions");
    expect(provider?.headers["api-key"]).toBe("azure-key");
  });

  test("prefers Foundry over GitHub when both env vars exist", () => {
    process.env.AZURE_FOUNDRY_ENDPOINT = "https://rehobbie.services.ai.azure.com";
    process.env.AZURE_FOUNDRY_API_KEY = "foundry-key";
    process.env.AZURE_FOUNDRY_DEPLOYMENT = "grok";
    process.env.GITHUB_MODELS_TOKEN = "github-token";

    const provider = resolveAiProvider();
    expect(provider?.url).not.toContain("models.github.ai");
    expect(provider?.headers["api-key"]).toBe("foundry-key");
  });

  test("returns null when no provider env vars are set", () => {
    delete process.env.AZURE_FOUNDRY_ENDPOINT;
    delete process.env.AZURE_FOUNDRY_API_KEY;
    delete process.env.AZURE_FOUNDRY_DEPLOYMENT;
    delete process.env.GITHUB_MODELS_TOKEN;
    expect(resolveAiProvider()).toBeNull();
  });
});
