"use client";

import { useStore } from "@/lib/store/useStore";
import Link from "next/link";
import { SavingsCard } from "@/components/upsell/SavingsCard";
import { CouponCard } from "@/components/upsell/CouponCard";
import { NearbyLocations } from "@/components/upsell/NearbyLocations";

export default function Home() {
  const { user, currentStreak, earnedBadges, stats } = useStore();

  return (
    <div className="p-6 space-y-6 pt-12 pb-24">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-teal-90 rounded-full overflow-hidden relative">
          {/* Placeholder Avatar */}
          <img
            src={user.profilePictureUrl}
            alt={user.firstName}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-teal-50">
            Hello, {user.firstName}
          </h1>
          <p className="text-grey-50 text-sm">Welcome back to Industrious</p>
        </div>
      </div>

      {/* Streak Card */}
      <div className="bg-gradient-to-br from-teal-50 to-teal-70 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <p className="opacity-90 font-medium mb-1">Current Streak</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-6xl font-extrabold">{currentStreak}</span>
            <span className="text-xl opacity-90">Days</span>
          </div>
          <p className="text-sm opacity-80 mt-2">
            You are on fire! Check in tomorrow to keep it going.
          </p>
        </div>
        {/* Background Decoration */}
        <div className="absolute -right-8 -bottom-8 text-9xl opacity-10 rotate-12">
          🔥
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/badges"
          className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
            🏆
          </div>
          <p className="text-grey-50 text-xs font-medium uppercase tracking-wider">
            Badges
          </p>
          <p className="text-2xl font-bold text-ocean-50">
            {earnedBadges.length}
          </p>
        </Link>
        <Link
          href="/stats"
          className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
            📍
          </div>
          <p className="text-grey-50 text-xs font-medium uppercase tracking-wider">
            Check-ins
          </p>
          <p className="text-2xl font-bold text-honey-50">
            {stats.totalCheckIns}
          </p>
        </Link>
      </div>

      {/* Recent Activity / Next Goal (Placeholder) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-grey-10 mb-4">Upcoming Goals</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-grey-50">
            <div className="w-10 h-10 rounded-full bg-grey-90 flex items-center justify-center text-xl">
              🌅
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-grey-10">
                The Early Riser
              </p>
              <div className="w-full h-1.5 bg-grey-90 rounded-full mt-1">
                <div className="bg-ocean-70 h-1.5 rounded-full w-[20%]"></div>
              </div>
            </div>
            <span className="text-xs font-mono">1/5</span>
          </div>
        </div>
      </div>

      {/* Phase 2: Upselling & Rewards */}
      <div className="space-y-4">
        <SavingsCard />

        <h3 className="font-bold text-grey-10 px-1">Rewards</h3>
        <div className="grid grid-cols-2 gap-3">
          <CouponCard
            title="Deep Work Monk"
            discount="50% Off Meeting Room"
            code="DEEP50"
            isUnlocked={currentStreak > 3} // Mock unlock logic
          />
          <CouponCard
            title="Bring a Friend"
            discount="Free Day Pass"
            code="FRIENDFREE"
            isUnlocked={false}
          />
        </div>

        <NearbyLocations />
      </div>
    </div>
  );
}
