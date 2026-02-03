"use client";

import { useStore } from "@/lib/store/useStore";
import { BadgeCard } from "@/components/badges/BadgeCard";
import { WrappedBanner } from "@/components/badges/WrappedBanner";
import { RedeemShop } from "@/components/shop/RedeemShop";
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
  const { earnedBadges, stats, yearFilter, setYearFilter } = useStore();
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

  // Calculate generic progress for demo purposes if not tracked in backend
  // In a real app, this would come from `user.badgeProgress`
  const getProgress = (badgeId: string) => {
    // Mock logic based on Figma descriptions roughly or just random/static for visual
    if (badgeId === "early-riser") return 20;
    if (badgeId === "full-house") return 5;
    if (badgeId === "pollinator") return 33;
    return 0;
  };

  return (
    <div className="p-5 pt-10 pb-32 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-teal-900 mb-1">My Activity</h1>
      </div>

      {/* Wrapped Banner */}
      <WrappedBanner />

      {/* Stats Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-teal-900">Stats</h2>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-grey-100 rounded-lg p-1 text-[10px] font-bold uppercase text-teal-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="">All Time</option>
            {[...Array(3)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-sm border border-grey-200 overflow-hidden">
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
            action={{ label: "View Map", href: "#" }}
          />
          <StatRow
            label="Meeting Rooms"
            value={stats.meetingRoomCount}
            icon="🤝"
            subtext="Hours booked"
            action={{ label: "Book Room", href: "#" }}
          />
        </div>
      </section>

      <hr className="border-grey-100" />

      {/* Redeem Shop Section */}
      <section>
        <RedeemShop />
      </section>

      <hr className="border-grey-100" />

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
                progress={earnedData ? 100 : getProgress(badge.id)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
