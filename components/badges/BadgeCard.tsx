"use client";

import clsx from "clsx";
import { Badge, EarnedBadge } from "@/lib/types";

interface BadgeCardProps {
  badge: Badge;
  isEarned: boolean;
  earnedDate?: string;
  progress?: number; // 0 to 100
}

export function BadgeCard({
  badge,
  isEarned,
  earnedDate,
  progress,
}: BadgeCardProps) {
  // Map brand colors to Tailwind classes
  const colorMap: Record<string, string> = {
    honey: "from-honey-50 to-honey-70",
    teal: "from-teal-50 to-teal-70",
    ocean: "from-ocean-50 to-ocean-70",
    sunset: "from-sunset-50 to-sunset-70",
    grey: "from-grey-50 to-grey-70",
  };

  const gradientClass = isEarned ? colorMap[badge.color] || colorMap.grey : "";

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl p-6 shadow-sm transition-all active:scale-95",
        isEarned
          ? `bg-gradient-to-br ${gradientClass} text-grey-10`
          : "bg-white border border-grey-80",
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="text-4xl">{badge.icon}</div>
        {isEarned && (
          <span className="bg-white/30 backdrop-blur-sm text-xs px-2 py-1 rounded-full font-medium">
            Earned
          </span>
        )}
      </div>

      <h3
        className={clsx(
          "text-lg font-bold mb-1",
          isEarned ? "text-grey-10" : "text-grey-50",
        )}
      >
        {badge.name}
      </h3>

      <p
        className={clsx(
          "text-sm leading-snug",
          isEarned ? "text-grey-10/80" : "text-grey-50",
        )}
      >
        {badge.description}
      </p>

      {/* Progress Bar for locked badges */}
      {!isEarned && progress !== undefined && (
        <div className="mt-4">
          <div className="h-2 bg-grey-90 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-50 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-grey-50 mt-1 text-right">{progress}%</p>
        </div>
      )}

      {isEarned && earnedDate && (
        <div className="mt-4 text-xs text-grey-10/70">
          On {new Date(earnedDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
