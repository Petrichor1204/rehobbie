"use client";

import { SketchBorder } from "@/components/SketchBorder";

type Props = {
  children: React.ReactNode;
  onBack?: () => void;
};

export function OnboardingShell({ children, onBack }: Props) {
  return (
    <main className="relative min-h-screen bg-rehobbie-cream overflow-hidden">
      <div className="absolute inset-0 pointer-events-none lined-paper" aria-hidden="true" />
      <SketchBorder />

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute top-10 left-6 z-20 text-rehobbie-muted font-body text-sm flex items-center gap-1 hover:text-rehobbie-subtext-dark transition-colors"
        >
          ← Back
        </button>
      )}

      <div className="relative z-10 flex flex-col items-center min-h-screen w-full max-w-md mx-auto px-6 py-10">
        {children}
      </div>
    </main>
  );
}
