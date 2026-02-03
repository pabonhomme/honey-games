"use client";

import { useStore } from "@/lib/store/useStore";
import Link from "next/link";
import { SavingsCard } from "@/components/upsell/SavingsCard";
import { CouponCard } from "@/components/upsell/CouponCard";
import { NearbyLocations } from "@/components/upsell/NearbyLocations";

export default function Home() {
  const { user, currentStreak, earnedBadges, stats } = useStore();

  return (
    <div className="p-5 space-y-6 pt-10 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-grey-500 text-xs font-semibold uppercase tracking-widest mb-1">
            Welcome back
          </p>
          <h1 className="text-3xl font-light text-teal-900 leading-tight">
            {user.firstName}
          </h1>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
          {/* Placeholder Avatar */}
          <img
            src={user.profilePictureUrl}
            alt={user.firstName}
            className="w-full h-full object-cover grayscale opacity-90"
          />
        </div>
      </div>

      {/* Streak Card - Minimalist */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-grey-200 relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-grey-500 text-xs font-bold uppercase tracking-widest mb-1">
              Daily Streak
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-light text-teal-900">
                {currentStreak}
              </span>
              <span className="text-lg text-teal-700">days</span>
            </div>
            <p className="text-sm text-grey-500 mt-1">
              Keep the momentum going.
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-sand border border-grey-200 flex items-center justify-center text-2xl">
            🔥
          </div>
        </div>
      </div>

      {/* Primary Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/badges"
          className="bg-white p-5 rounded-xl shadow-sm border border-grey-200 hover:border-teal-900/20 hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-300">
              🏆
            </div>
            <span className="text-2xl font-bold text-teal-900">
              {earnedBadges.length}
            </span>
          </div>
          <p className="text-grey-500 text-xs font-bold uppercase tracking-wider group-hover:text-teal-900">
            Badges
          </p>
        </Link>
        <Link
          href="/stats"
          className="bg-white p-5 rounded-xl shadow-sm border border-grey-200 hover:border-teal-900/20 hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-300">
              📍
            </div>
            <span className="text-2xl font-bold text-teal-900">
              {stats.totalCheckIns}
            </span>
          </div>
          <p className="text-grey-500 text-xs font-bold uppercase tracking-wider group-hover:text-teal-900">
            Check-ins
          </p>
        </Link>
      </div>

      {/* Upcoming Goals - List View */}
      <div>
        <h3 className="text-lg font-medium text-teal-900 mb-3 px-1">
          Next Goal
        </h3>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-grey-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center text-xl grayscale border border-grey-100">
            🌅
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-bold text-teal-900">The Early Riser</p>
              <span className="text-xs font-mono text-grey-500">1/5</span>
            </div>
            <div className="w-full h-1.5 bg-grey-100 rounded-full overflow-hidden">
              <div className="bg-teal-900 h-full w-[20%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 2: Upselling & Rewards - Clean Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-teal-900 pt-2 px-1">For You</h3>
        <SavingsCard />

        <div className="grid grid-cols-2 gap-3">
          <CouponCard
            title="Deep Work"
            discount="50% Off"
            code="DEEP50"
            isUnlocked={currentStreak > 3} // Mock unlock
          />
          <CouponCard
            title="Guest Pass"
            discount="Free"
            code="FRIENDFREE"
            isUnlocked={false}
          />
        </div>

        <NearbyLocations />
      </div>
    </div>
  );
}
