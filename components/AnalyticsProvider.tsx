"use client";

import { useEffect } from "react";
import { ensureAnonSession } from "@/lib/supabase";

// Boots an anonymous Supabase session on first client render (no-op without keys).
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void ensureAnonSession();
  }, []);

  return <>{children}</>;
}
