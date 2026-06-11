"use client";

import { SketchBorder } from "@/components/SketchBorder";

type Props = {
  children: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
};

// Scrollable page frame for Phase 2 pages (dashboard / explore). Keeps the
// hand-drawn border + lined-paper aesthetic but allows content taller than the
// viewport, unlike the centered OnboardingShell.
export function PageFrame({ children, onBack, backLabel = "← Back" }: Props) {
  return (
    <main className="relative min-h-screen bg-rehobbie-cream">
      <div className="fixed inset-0 pointer-events-none lined-paper" aria-hidden="true" />
      <SketchBorder />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-10">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-8 text-rehobbie-muted font-body text-sm flex items-center gap-1 hover:text-rehobbie-subtext-dark transition-colors"
          >
            {backLabel}
          </button>
        )}
        {children}
      </div>
    </main>
  );
}
