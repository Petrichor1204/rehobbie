"use client";
// app/dashboard/page.tsx — Phase 2: swipe yes (comeback) or explore pick (discovery).

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { useOnboardingStore } from "@/store/onboarding";
import { getResources } from "@/lib/resources";
import { generateRecoveryPlan } from "@/lib/foundry";
import { findPeers } from "@/lib/peers";
import { PageFrame } from "@/components/PageFrame";
import { SkillSelector } from "@/components/dashboard/SkillSelector";
import { RecoveryPlanWrapped } from "@/components/dashboard/RecoveryPlanWrapped";
import { ResourceShelf } from "@/components/dashboard/ResourceShelf";
import { PeopleAtYourLevel } from "@/components/dashboard/PeopleAtYourLevel";
import { OthersLikeYou } from "@/components/dashboard/OthersLikeYou";
import { FindPeersResult, RecoveryPlan, SkillLevel } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const {
    favoriteHobby,
    stopReasons,
    skillLevel,
    setSkillLevel,
    isDiscovery,
  } = useOnboardingStore();

  const [plan, setPlan] = useState<RecoveryPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [peers, setPeers] = useState<FindPeersResult | null>(null);
  const [peersLoading, setPeersLoading] = useState(false);
  const requestId = useRef(0);
  const peersRequestId = useRef(0);

  const wantsCommunity = stopReasons.some((r) => r.id === "no-community");

  useEffect(() => {
    if (!favoriteHobby) router.replace("/");
  }, [favoriteHobby, router]);

  useEffect(() => {
    if (!favoriteHobby || !skillLevel) {
      setPlan(null);
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    setPlan(null);
    generateRecoveryPlan({
      hobby: favoriteHobby,
      skillLevel,
      stopReasons,
      mode: isDiscovery ? "discovery" : "comeback",
    }).then((result) => {
      if (id === requestId.current) {
        setPlan(result);
        setLoading(false);
      }
    });
  }, [favoriteHobby, skillLevel, stopReasons, isDiscovery]);

  // Foundry IQ: match them with people at their skill level when loneliness was the blocker.
  useEffect(() => {
    if (!favoriteHobby || !skillLevel || !wantsCommunity) {
      setPeers(null);
      return;
    }
    const id = ++peersRequestId.current;
    setPeersLoading(true);
    setPeers(null);
    findPeers({ hobby: { id: favoriteHobby.id, label: favoriteHobby.label }, skillLevel })
      .then((result) => {
        if (id === peersRequestId.current) setPeers(result);
      })
      .finally(() => {
        if (id === peersRequestId.current) setPeersLoading(false);
      });
  }, [favoriteHobby, skillLevel, wantsCommunity]);

  if (!favoriteHobby) return null;

  const resources = getResources(favoriteHobby.id, favoriteHobby.label);

  function handleSkill(level: SkillLevel) {
    setSkillLevel(level);
  }

  return (
    <PageFrame onBack={() => router.push("/")} backLabel="← Home">
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
          <p className="font-body text-sm text-rehobbie-muted">
            {isDiscovery ? "discover" : "welcome back to"}
          </p>
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
        <RecoveryPlanWrapped
          plan={plan}
          loading={loading}
          hasSkillLevel={!!skillLevel}
          hobbyImage={favoriteHobby.image}
          hobbyLabel={favoriteHobby.label}
          isDiscovery={isDiscovery}
        />
        {wantsCommunity && (
          <PeopleAtYourLevel
            result={peers}
            loading={peersLoading}
            skillLevel={skillLevel}
          />
        )}
        <ResourceShelf resources={resources} />
        {!isDiscovery && !wantsCommunity && (
          <OthersLikeYou hobbyLabel={favoriteHobby.label} />
        )}
      </div>
    </PageFrame>
  );
}
