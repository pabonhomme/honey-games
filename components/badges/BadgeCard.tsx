"use client";

import clsx from "clsx";
import { Badge } from "@/lib/types";

interface BadgeCardProps {
  badge: Badge;
  isEarned: boolean;
  earnedDate?: string;
  progress?: number;
}

export function BadgeCard({
  badge,
  isEarned,
  earnedDate,
  progress,
}: BadgeCardProps) {
  return (
    <div
      className={clsx(
        "relative rounded-xl p-5 shadow-sm transition-all h-full flex flex-col justify-between group overflow-hidden",
        isEarned
          ? "bg-white border-2 border-gold-500 shadow-md"
          : "bg-grey-100 border border-transparent opacity-80",
      )}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div
            className={clsx(
              "text-4xl filter transition-transform duration-300",
              isEarned ? "grayscale-0 drop-shadow-sm" : "grayscale opacity-50",
              "group-hover:scale-110",
            )}
          >
            {badge.icon}
          </div>
          {isEarned && (
            <div className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              ✓
            </div>
          )}
        </div>

        <h3
          className={clsx(
            "text-lg font-bold mb-1 leading-tight",
            isEarned ? "text-teal-900" : "text-grey-500",
          )}
        >
          {badge.name}
        </h3>

        <p className="text-xs text-grey-500 leading-snug">
          {badge.description}
        </p>
      </div>

      {/* Footer / Status */}
      <div className="mt-4 pt-3 border-t border-grey-200/50">
        {!isEarned && (
          <div className="w-full">
            <div className="flex justify-between text-[10px] uppercase font-bold text-grey-500 mb-1">
              <span>Progress</span>
              <span>{progress || 0}%</span>
            </div>
            <div className="h-1.5 bg-grey-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-500"
                style={{ width: `${progress || 0}%` }}
              />
            </div>
          </div>
        )}

        {isEarned && earnedDate && (
          <p className="text-[10px] font-medium text-teal-700 uppercase tracking-wider">
            Earned on{" "}
            {new Date(earnedDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Accents */}
      {isEarned && (
        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gold-500/10 rounded-full blur-xl pointer-events-none" />
      )}
    </div>
  );
}
