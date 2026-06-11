"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import { SketchBorder } from "@/components/SketchBorder";

// Spread across the full desktop viewport — larger, looser composition.
// Each entry positions by % so it scales with the window.
const FLOATING_ICONS = [
  { id: "gardening", src: "/images/gardening.png",    alt: "Gardening",   top: "14%", left: "9%",  size: 190, delay: 0   },
  { id: "cooking",   src: "/images/cooking.png",      alt: "Cooking",     top: "20%", left: "31%", size: 150, delay: 0.4 },
  { id: "novel",     src: "/images/reading.png",      alt: "Reading",     top: "12%", left: "55%", size: 170, delay: 0.8 },
  { id: "guitar",    src: "/images/music.png",        alt: "Music",       top: "30%", left: "78%", size: 200, delay: 0.2 },
  { id: "camera",    src: "/images/photography.png",  alt: "Photography", top: "46%", left: "16%", size: 165, delay: 0.6 },
  { id: "palette",   src: "/images/painting.png",     alt: "Painting",    top: "52%", left: "47%", size: 165, delay: 1.0 },
  { id: "singer",    src: "/images/singing.png",      alt: "Singing",     top: "58%", left: "27%", size: 200, delay: 0.3 },
  { id: "karate",    src: "/images/karate.png",       alt: "Karate",      top: "55%", left: "70%", size: 180, delay: 0.7 },
];

function floatVariants(delay: number): Record<string, any> {
  return {
    initial: { y: "0%", rotate: 0 },
    animate: {
      y: ["0%", "-5%", "0%"],
      rotate: [-1.5, 1.5, -1.5],
      transition: {
        duration: 3.5 + delay * 0.4,
        repeat: Infinity,
        ease: [0.42, 0, 0.58, 1] as const,
        delay,
      },
    },
  };
}

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-rehobbie-cream select-none">

      <SketchBorder />

      {/* Logo — top right */}
      <Image
        src="/images/rehobbie_logo.png"
        alt="Rehobbie"
        width={468}
        height={212}
        priority
        className="absolute top-8 right-10 z-10 w-[clamp(140px,12vw,200px)] h-auto"
      />

      {/* Floating hobby illustrations spread across the viewport */}
      {FLOATING_ICONS.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ top: icon.top, left: icon.left }}
          variants={floatVariants(icon.delay)}
          initial="initial"
          animate="animate"
        >
          <Image
            src={icon.src}
            alt={icon.alt}
            width={icon.size}
            height={icon.size}
            className="drop-shadow-sm h-auto w-[clamp(96px,13vw,200px)]"
            draggable={false}
            priority={icon.id === "camera"}
          />
        </motion.div>
      ))}

      {/* Get started — illustration only, no button chrome */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-10">
        <motion.button
          type="button"
          onClick={() => router.push("/onboarding")}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="appearance-none border-0 bg-transparent p-0 cursor-pointer shadow-none outline-none focus-visible:ring-2 focus-visible:ring-rehobbie-green focus-visible:ring-offset-2 rounded-sm"
          aria-label="Get started"
        >
          <Image
            src="/images/get_started_button.png"
            alt=""
            width={603}
            height={217}
            className="object-contain w-[clamp(200px,22vw,300px)] h-auto"
            draggable={false}
          />
        </motion.button>
      </div>
    </main>
  );
}
