"use client";

import { useStore } from "@/lib/store/useStore";
import { BADGES } from "@/lib/constants/badges";
import { BadgeCard } from "@/components/badges/BadgeCard";

export default function BadgesPage() {
  const { earnedBadges } = useStore();

  const isEarned = (badgeId: string) =>
    earnedBadges.some((b) => b.badgeId === badgeId);
  const getEarnedDate = (badgeId: string) =>
    earnedBadges.find((b) => b.badgeId === badgeId)?.earnedAt;

  return (
    <div className="p-5 pt-10 pb-24">
      <div className="mb-6">
        <h1 className="text-3xl font-light text-teal-900 mb-1">Your Badges</h1>
        <p className="text-sm text-grey-500">
          Collect them all by visiting and engaging!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.values(BADGES).map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            isEarned={isEarned(badge.id)}
            earnedDate={getEarnedDate(badge.id)}
            progress={isEarned(badge.id) ? 100 : 0}
          />
        ))}
      </div>
    </div>
  );
}
