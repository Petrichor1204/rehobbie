"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import { SketchBorder } from "@/components/SketchBorder";

// Horizontal band across the centre of the page — orderly, gently waved.
const HOBBIES = [
  { id: "gardening", src: "/images/gardening.png",   alt: "Gardening",   size: 150, lift: 0,  delay: 0.0 },
  { id: "camera",    src: "/images/photography.png", alt: "Photography", size: 140, lift: 36, delay: 0.5 },
  { id: "guitar",    src: "/images/music.png",       alt: "Music",       size: 160, lift: 0,  delay: 0.2 },
  { id: "cooking",   src: "/images/cooking.png",     alt: "Cooking",     size: 135, lift: 40, delay: 0.7 },
  { id: "palette",   src: "/images/painting.png",    alt: "Painting",    size: 140, lift: 0,  delay: 0.3 },
  { id: "novel",     src: "/images/reading.png",     alt: "Reading",     size: 150, lift: 36, delay: 0.6 },
  { id: "singer",    src: "/images/singing.png",     alt: "Singing",     size: 165, lift: 0,  delay: 0.4 },
  { id: "karate",    src: "/images/karate.png",      alt: "Karate",      size: 150, lift: 40, delay: 0.8 },
];

function floatVariants(delay: number): Record<string, any> {
  return {
    initial: { y: "0%" },
    animate: {
      y: ["0%", "-5%", "0%"],
      transition: {
        duration: 4 + delay * 0.4,
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
    <main className="relative w-full min-h-screen overflow-hidden bg-[#F4F1EA]">
      <SketchBorder />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 py-10">
        {/* REHOBBIE — top center */}
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

        {/* Centre block: tagline → horizontal hobby band → get started */}
        <div className="flex-1 flex flex-col items-center justify-center gap-10 w-full">
          <p className="font-sketch text-2xl md:text-3xl text-rehobbie-ink/80 text-center leading-snug max-w-sm">
            rediscover the hobbies you used to love
          </p>

          <div className="flex flex-wrap items-end justify-center gap-x-7 md:gap-x-9 gap-y-12 max-w-5xl w-full">
            {HOBBIES.map((hobby) => (
              <div key={hobby.id} className="relative" style={{ marginBottom: hobby.lift }}>
                <motion.div
                  variants={floatVariants(hobby.delay)}
                  initial="initial"
                  animate="animate"
                >
                  <Image
                    src={hobby.src}
                    alt={hobby.alt}
                    width={hobby.size}
                    height={hobby.size}
                    className="relative z-10 h-auto w-[clamp(86px,9.5vw,128px)] drop-shadow-sm"
                    draggable={false}
                    priority={hobby.id === "gardening" || hobby.id === "guitar"}
                  />
                </motion.div>
                {/* Ground shadow at the bottom of each image */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 z-0 h-3 w-[60%] rounded-[50%] bg-rehobbie-ink/25 blur-[6px]" />
              </div>
            ))}
          </div>

          <motion.button
            type="button"
            onClick={() => router.push("/onboarding")}
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
