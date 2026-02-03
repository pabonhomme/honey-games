"use client";

import { useStore } from "@/lib/store/useStore";
import { BadgeCard } from "@/components/badges/BadgeCard";
import { BADGES } from "@/lib/constants/badges";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";

function StatRow({
  label,
  value,
  icon,
  subtext,
  action,
}: {
  label: string;
  value: number | string;
  icon: string;
  subtext?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-grey-100 last:border-0 hover:bg-sand transition-colors group">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-grey-100 flex items-center justify-center text-lg grayscale group-hover:grayscale-0 transition-all">
          {icon}
        </div>
        <div>
          <p className="text-teal-900 font-bold text-sm">{label}</p>
          {subtext && <p className="text-xs text-grey-500">{subtext}</p>}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xl font-light text-teal-700">{value}</span>
        {action && (
          <Link
            href={action.href}
            className="text-[10px] uppercase font-bold text-gold-600 hover:text-gold-700 hover:underline"
          >
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ActivityPage() {
  const { earnedBadges, stats } = useStore();
  const [filter, setFilter] = useState<"all" | "earned" | "locked">("all");

  const isEarned = (badgeId: string) =>
    earnedBadges.some((b) => b.badgeId === badgeId);
  const getEarnedData = (badgeId: string) =>
    earnedBadges.find((b) => b.badgeId === badgeId);

  const filteredBadges = Object.values(BADGES).filter((badge) => {
    if (filter === "earned") return isEarned(badge.id);
    if (filter === "locked") return !isEarned(badge.id);
    return true;
  });

  return (
    <div className="p-5 pt-10 pb-24 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-teal-900 mb-1">My Activity</h1>
        <p className="text-sm text-grey-500">
          Track your progress and achievements.
        </p>
      </div>

      {/* Stats Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-teal-900">Stats</h2>
        <div className="bg-white rounded-xl shadow-sm border border-grey-200 overflow-hidden">
          <div className="p-4 bg-sand border-b border-grey-200 flex justify-end">
            {/* Mock Year Selector */}
            <select className="bg-transparent text-xs font-bold text-teal-900 border-none outline-none cursor-pointer">
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
          <StatRow
            label="Total Check-ins"
            value={stats.totalCheckIns}
            icon="📍"
            subtext="All time visits"
          />
          <StatRow
            label="Locations Visited"
            value={stats.locationsVisited}
            icon="🌍"
            subtext="Across the network"
            action={{ label: "View All", href: "#" }}
          />
          <StatRow
            label="Meeting Rooms"
            value={stats.meetingRoomCount}
            icon="🤝"
            subtext="Hours booked"
            action={{ label: "Book Room", href: "#" }}
          />
          <StatRow
            label="Day Passes"
            value={stats.dayPassCount}
            icon="🎫"
            subtext="Desks used"
            action={{ label: "Buy Pass", href: "#" }}
          />
        </div>
      </section>

      {/* Badges Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-teal-900">Badges</h2>
          <div className="flex bg-grey-100 rounded-lg p-1 gap-1">
            {(["all", "earned", "locked"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all",
                  filter === f
                    ? "bg-white text-teal-900 shadow-sm"
                    : "text-grey-500 hover:text-teal-900",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredBadges.map((badge) => {
            const earnedData = getEarnedData(badge.id);
            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isEarned={!!earnedData}
                earnedDate={earnedData?.earnedAt}
                count={earnedData?.count}
                progress={earnedData ? 100 : 0}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
