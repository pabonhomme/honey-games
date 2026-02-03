import clsx from "clsx";
import { Badge } from "@/lib/types";

interface BadgeCardProps {
  badge: Badge;
  isEarned: boolean;
  earnedDate?: string;
  progress?: number;
  count?: number;
}

export function BadgeCard({
  badge,
  isEarned,
  earnedDate,
  progress,
  count,
}: BadgeCardProps) {
  return (
    <div className="group relative h-full">
      <div
        className={clsx(
          "relative rounded-xl p-5 shadow-sm transition-all h-full flex flex-col justify-between overflow-hidden",
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
                isEarned
                  ? "grayscale-0 drop-shadow-sm"
                  : "grayscale opacity-50",
                "group-hover:scale-110",
              )}
            >
              {badge.icon}
            </div>
            {isEarned && (
              <div className="flex items-center gap-1">
                {count && count > 1 && (
                  <div className="px-1.5 py-0.5 rounded-full bg-gold-100 text-gold-700 text-[10px] font-bold border border-gold-200">
                    x{count}
                  </div>
                )}
                <div className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  ✓
                </div>
              </div>
            )}
            {!isEarned && badge.isMemberOnly && (
              <div className="px-1.5 py-0.5 rounded-full bg-teal-900 text-white text-[10px] font-bold uppercase tracking-wider">
                Member
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

      {/* Upsell Tooltip (on Hover for Locked Badges) */}
      {!isEarned && badge.upsell && (
        <div className="absolute inset-0 bg-teal-900/95 backdrop-blur-sm rounded-xl p-4 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none group-hover:pointer-events-auto">
          <p className="text-white font-bold text-sm mb-1">
            {badge.upsell.title}
          </p>
          <p className="text-white/80 text-xs mb-3">
            {badge.upsell.description}
          </p>
          <button className="bg-gold-500 text-teal-900 text-xs font-bold py-1.5 px-3 rounded-full hover:bg-gold-400 transition-colors">
            {badge.upsell.cta}
          </button>
        </div>
      )}
    </div>
  );
}
