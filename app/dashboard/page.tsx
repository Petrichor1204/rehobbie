"use client";
// app/dashboard/page.tsx — Phase 2: the "swipe yes" destination.
// Order: skill selector → AI recovery plan (Foundry) → resources → others like you.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { useOnboardingStore } from "@/store/onboarding";
import { getResources } from "@/lib/resources";
import { generateRecoveryPlan } from "@/lib/foundry";
import { capture } from "@/lib/posthog";
import { PageFrame } from "@/components/PageFrame";
import { SkillSelector } from "@/components/dashboard/SkillSelector";
import { RecoveryPlanCard } from "@/components/dashboard/RecoveryPlanCard";
import { ResourceShelf } from "@/components/dashboard/ResourceShelf";
import { OthersLikeYou } from "@/components/dashboard/OthersLikeYou";
import { RecoveryPlan, SkillLevel } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { favoriteHobby, stopReasons, skillLevel, setSkillLevel } = useOnboardingStore();

  const [plan, setPlan] = useState<RecoveryPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  // If someone lands here without finishing the flow, send them home.
  useEffect(() => {
    if (!favoriteHobby) router.replace("/");
  }, [favoriteHobby, router]);

  // Fire the AI plan whenever the hobby, level, or reasons change.
  useEffect(() => {
    if (!favoriteHobby || !skillLevel) {
      setPlan(null);
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    setPlan(null);
    generateRecoveryPlan({ hobby: favoriteHobby, skillLevel, stopReasons }).then(
      (result) => {
        // Ignore stale responses (level changed mid-flight).
        if (id === requestId.current) {
          setPlan(result);
          setLoading(false);
        }
      }
    );
  }, [favoriteHobby, skillLevel, stopReasons]);

  if (!favoriteHobby) return null;

  const resources = getResources(favoriteHobby.id, favoriteHobby.label);

  function handleSkill(level: SkillLevel) {
    setSkillLevel(level);
    capture("dashboard_skill_selected", {
      level,
      hobby: favoriteHobby?.id,
    });
  }

  return (
    <PageFrame onBack={() => router.push("/")} backLabel="← Home">
      {/* Header */}
      <header className="flex items-center gap-4 mb-10">
        <div className="relative w-20 h-20 shrink-0">
          <Image
            src={favoriteHobby.image}
            alt={favoriteHobby.label}
            width={80}
            height={80}
            className="object-contain drop-shadow-sm"
            priority
          />
        </div>
        <div>
          <p className="font-body text-sm text-rehobbie-muted">welcome back to</p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sketch text-4xl font-bold text-rehobbie-ink leading-none"
          >
            {favoriteHobby.label}
          </motion.h1>
        </div>
      </header>

      <div className="flex flex-col gap-12">
        <SkillSelector value={skillLevel} onChange={handleSkill} />
        <RecoveryPlanCard plan={plan} loading={loading} hasSkillLevel={!!skillLevel} />
        <ResourceShelf resources={resources} />
        <OthersLikeYou hobbyLabel={favoriteHobby.label} />
      </div>
    </PageFrame>
  );
}
