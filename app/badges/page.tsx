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
    <div className="p-6 pt-12 pb-24">
      <h1 className="text-3xl font-bold mb-2">Your Badges</h1>
      <p className="text-grey-50 mb-6">
        Collect them all by visiting and engaging!
      </p>

      <div className="grid grid-cols-2 gap-4">
        {Object.values(BADGES).map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            isEarned={isEarned(badge.id)}
            earnedDate={getEarnedDate(badge.id)}
            progress={isEarned(badge.id) ? 100 : 0} // Simplify progress for now
          />
        ))}
      </div>
    </div>
  );
}
