"use client";
// app/page.tsx — HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
// Matches Figma "Home" frame:
//   - "REHOBBIE" wordmark top-right
//   - Hobby illustrations floating around the screen with gentle motion
//   - "Get started" button in the centre-bottom area
//
// MOTION: Each icon floats independently using Motion (framer-motion fork).
// Install: npm install motion
// ─────────────────────────────────────────────────────────────────────────────

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";

// ─── Floating icon positions ──────────────────────────────────────────────────
// Each entry: { src, alt, top, left } — tweak these % values to match your
// Figma layout exactly. These roughly match the scattered arrangement shown.
// ─────────────────────────────────────────────────────────────────────────────
const FLOATING_ICONS = [
  { id: "gardening", src: "/images/gardening.png",       alt: "Gardening",    top: "12%", left: "8%",  size: 110, delay: 0    },
  { id: "cooking",   src: "/images/cooking.png",         alt: "Cooking",      top: "18%", left: "28%", size: 90,  delay: 0.4  },
  { id: "novel",     src: "/images/reading.png",         alt: "Reading",      top: "8%",  left: "52%", size: 100, delay: 0.8  },
  { id: "guitar",    src: "/images/music.png",          alt: "Music",        top: "28%", left: "68%", size: 120, delay: 0.2  },
  { id: "camera",    src: "/images/photography.png",     alt: "Photography",  top: "52%", left: "14%", size: 95,  delay: 0.6  },
  { id: "palette",   src: "/images/painting.png",        alt: "Painting",     top: "55%", left: "58%", size: 100, delay: 1.0  },
  { id: "singer",    src: "/images/singing.png",         alt: "Singing",      top: "68%", left: "34%", size: 110, delay: 0.3  },
  { id: "karate",    src: "/images/karate.png",          alt: "Karate",       top: "62%", left: "76%", size: 100, delay: 0.7  },
  // ← Add more hobby icons here; position them with top/left %
];

// Float animation — gentle up-and-down per icon
function floatVariants(delay: number): Record<string, any> {
  return {
    initial: { y: '0%', rotate: 0 },
    animate: {
      y: ['0%', '-6%', '0%'],
      rotate: [-1.5, 1.5, -1.5],
      transition: {
        duration: 3.5 + delay * 0.4,
        repeat: Infinity,
        // use a bezier easing array instead of a string to satisfy types
        ease: [0.42, 0, 0.58, 1],
        delay,
      },
    },
  }
}

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-[#FAF8F4] select-none">

      {/* ── Wordmark ─────────────────────────────────────────────────────────── */}
      <h1 className="font-sketch absolute top-6 right-8 text-3xl font-bold tracking-widest text-[#2D2D2D] z-10">
        REHOBBIE
      </h1>

      {/* ── Floating hobby illustrations ──────────────────────────────────────── */}
      {FLOATING_ICONS.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute"
          style={{ top: icon.top, left: icon.left }}
          variants={floatVariants(icon.delay)}
          animate="animate"
        >
          {/*
            ─────────────────────────────────────────────────────────────────────
            PLACEHOLDER: Replace <Image> with your own illustrated component
            if you have a custom wrapper. Make sure the image file exists in
            /public/images/ with the filename matching `icon.src`.
            ─────────────────────────────────────────────────────────────────────
          */}
          <Image
            src={icon.src}
            alt={icon.alt}
            width={icon.size}
            height={icon.size}
            className="drop-shadow-sm"
            draggable={false}
          />
        </motion.div>
      ))}

      {/* ── Get started button ───────────────────────────────────────────────── */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
        <motion.button
          onClick={() => router.push("/onboarding")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="p-0 bg-transparent rounded-full shadow-md hover:opacity-95 transition-opacity"
          type="button"
        >
          <Image
            src="/images/get_started_button.png"
            alt="Get started"
            width={240}
            height={80}
            className="object-contain"
            draggable={false}
          />
          <span className="sr-only">Get started</span>
        </motion.button>
      </div>

      {/* ── Subtle tagline ────────────────────────────────────────────────────── */}
      <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm text-[#888] font-body tracking-wide whitespace-nowrap">
        pick up where you left off
      </p>
    </main>
  );
}