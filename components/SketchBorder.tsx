"use client";

// A hand-drawn looking page border. The line "draws" itself in on mount, then
// keeps a subtle pencil-jitter via an animated turbulence/displacement filter.
export function SketchBorder() {
  return (
    <div className="pointer-events-none fixed inset-3 sm:inset-4 z-30" aria-hidden="true">
      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <filter id="sketch-jitter" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018"
              numOctaves="2"
              seed="3"
              result="noise"
            >
              <animate
                attributeName="seed"
                values="3;7;11;3"
                dur="1.6s"
                calcMode="discrete"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
          </filter>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="20"
          ry="20"
          pathLength={100}
          fill="none"
          stroke="#2D2D2D"
          strokeWidth={2}
          strokeLinecap="round"
          filter="url(#sketch-jitter)"
          className="sketch-border-line"
        />
      </svg>
    </div>
  );
}
