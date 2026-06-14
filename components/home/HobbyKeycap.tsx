"use client";

import { motion } from "motion/react";
import Image from "next/image";

type HobbyKeycapProps = {
  src: string;
  alt: string;
  label: string;
  delay: number;
  lift: number;
  variant?: "cream" | "paper";
  onClick?: () => void;
};

export function HobbyKeycap({
  src,
  alt,
  label,
  delay,
  lift,
  variant = "cream",
  onClick,
}: HobbyKeycapProps) {
  const duration = 4.2 + delay * 0.35;
  const topBg = variant === "paper" ? "bg-rehobbie-paper" : "bg-rehobbie-cream";

  return (
    <div className="relative" style={{ marginBottom: lift }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: 1,
          y: [0, -6, 0],
        }}
        transition={{
          opacity: { duration: 0.45, delay: delay * 0.15, ease: "easeOut" },
          y: {
            duration,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
            delay,
          },
        }}
      >
        <motion.button
          type="button"
          onClick={onClick}
          aria-label={label}
          whileHover={{ y: 2, transition: { duration: 0.12 } }}
          whileTap={{ y: 6, transition: { duration: 0.08 } }}
          className="
            group relative flex flex-col items-center gap-2
            w-[clamp(88px,10vw,118px)]
            cursor-pointer appearance-none border-0 bg-transparent p-0
            outline-none focus-visible:ring-2 focus-visible:ring-rehobbie-green
            focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F1EA] rounded-xl
          "
        >
          <span
            className={`
              relative flex items-center justify-center
              w-full aspect-square rounded-[10px]
              border-2 border-rehobbie-border
              ${topBg}
              transition-[border-color,box-shadow] duration-100 ease-out
              group-hover:border-rehobbie-border-hover
              group-active:border-rehobbie-border-light
              group-hover:shadow-[0_3px_0_#C8C4BC,0_5px_0_#BFBBB2,0_10px_18px_rgba(45,45,45,0.1)]
              group-active:shadow-[0_0_0_#BFBBB2,0_2px_8px_rgba(45,45,45,0.08)]
              shadow-[0_4px_0_#C8C4BC,0_6px_0_#BFBBB2,0_12px_22px_rgba(45,45,45,0.11)]
            `}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-[6px] top-[5px] h-[2px] rounded-full bg-white/70"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-[5px] inset-y-[8px] w-[2px] rounded-full bg-white/45"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-[4px] inset-y-[10px] w-[2px] rounded-full bg-rehobbie-border-light/80"
            />

            <Image
              src={src}
              alt={alt}
              width={96}
              height={96}
              className="relative z-10 w-[68%] h-auto select-none pointer-events-none"
              draggable={false}
            />
          </span>

          <span className="font-sketch text-[clamp(0.95rem,2.2vw,1.15rem)] font-semibold text-rehobbie-ink/75 leading-none group-hover:text-rehobbie-ink transition-colors">
            {label}
          </span>
        </motion.button>
      </motion.div>

      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 -bottom-1 z-0 h-2.5 w-[72%] rounded-[50%] bg-rehobbie-ink/18 blur-[5px]"
      />
    </div>
  );
}
