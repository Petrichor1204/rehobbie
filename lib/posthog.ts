// lib/posthog.ts
// ─────────────────────────────────────────────────────────────────────────────
// PostHog product analytics (Step 7).
//
// Initialised once on the client via <AnalyticsProvider>. Every helper is a
// no-op when NEXT_PUBLIC_POSTHOG_KEY is missing, so the app runs without keys.
// Pageviews are captured manually (capture_pageview: false) because this is a
// client-routed SPA.
// ─────────────────────────────────────────────────────────────────────────────

import posthog from "posthog-js";

let initialized = false;

export function initPostHog(): void {
  if (initialized || typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return; // analytics disabled until a key is provided

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: false, // manual — see capturePageview()
    capture_pageleave: true,
    person_profiles: "always",
  });
  initialized = true;
}

export function capture(event: string, props?: Record<string, unknown>): void {
  if (!initialized) return;
  posthog.capture(event, props);
}

export function capturePageview(url: string): void {
  if (!initialized) return;
  posthog.capture("$pageview", { $current_url: url });
}

export { posthog };
