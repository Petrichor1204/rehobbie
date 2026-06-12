"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initPostHog, capturePageview } from "@/lib/posthog";
import { ensureAnonSession } from "@/lib/supabase";

// Boots analytics + an anonymous Supabase session on first client render, then
// captures a pageview on every route change. Both integrations no-op without keys.
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
    void ensureAnonSession();
  }, []);

  const pathname = usePathname();
  useEffect(() => {
    if (pathname) capturePageview(window.location.origin + pathname);
  }, [pathname]);

  return <>{children}</>;
}
