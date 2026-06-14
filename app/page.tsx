"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import { SketchBorder } from "@/components/SketchBorder";
import { HobbyKeycap } from "@/components/home/HobbyKeycap";

// Horizontal band — staggered lift keeps a gentle wave while each keycap floats in place.
const HOBBIES = [
  { id: "gardening",  src: "/images/gardening.png",   label: "Gardening",   lift: 0,  delay: 0.0, variant: "cream" as const },
  { id: "camera",     src: "/images/photography.png", label: "Photography", lift: 28, delay: 0.5, variant: "paper" as const },
  { id: "guitar",     src: "/images/music.png",       label: "Music",       lift: 0,  delay: 0.2, variant: "cream" as const },
  { id: "cooking",    src: "/images/cooking.png",     label: "Cooking",     lift: 32, delay: 0.7, variant: "paper" as const },
  { id: "palette",    src: "/images/painting.png",    label: "Painting",    lift: 0,  delay: 0.3, variant: "cream" as const },
  { id: "novel",      src: "/images/reading.png",     label: "Reading",     lift: 28, delay: 0.6, variant: "paper" as const },
  { id: "singer",     src: "/images/singing.png",     label: "Singing",     lift: 0,  delay: 0.4, variant: "cream" as const },
  { id: "karate",     src: "/images/karate.png",      label: "Karate",      lift: 32, delay: 0.8, variant: "paper" as const },
];

export default function HomePage() {
  const router = useRouter();

  function startOnboarding() {
    router.push("/onboarding");
  }

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-[#F4F1EA]">
      <SketchBorder />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src="/images/rehobbie_logo.png"
            alt="Rehobbie"
            width={468}
            height={212}
            priority
            className="w-[clamp(170px,18vw,250px)] h-auto"
          />
        </motion.div>

        <div className="flex-1 flex flex-col items-center justify-center gap-10 w-full">
          <p className="font-sketch text-2xl md:text-3xl text-rehobbie-ink/80 text-center leading-snug max-w-sm">
            rediscover the hobbies you used to love
          </p>

          <div className="flex flex-wrap items-end justify-center gap-x-5 md:gap-x-7 gap-y-10 max-w-5xl w-full px-2">
            {HOBBIES.map((hobby) => (
              <HobbyKeycap
                key={hobby.id}
                src={hobby.src}
                alt={hobby.label}
                label={hobby.label}
                lift={hobby.lift}
                delay={hobby.delay}
                variant={hobby.variant}
                onClick={startOnboarding}
              />
            ))}
          </div>

          <motion.button
            type="button"
            onClick={startOnboarding}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="appearance-none border-0 bg-transparent p-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-rehobbie-green focus-visible:ring-offset-2 rounded-sm"
            aria-label="Get started"
          >
            <Image
              src="/images/get_started_button.png"
              alt=""
              width={603}
              height={217}
              className="object-contain w-[clamp(200px,22vw,290px)] h-auto drop-shadow-md"
              draggable={false}
            />
          </motion.button>
        </div>
      </div>
    </main>
  );
}
