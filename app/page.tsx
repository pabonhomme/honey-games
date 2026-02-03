"use client";

import { useStore } from "@/lib/store/useStore";
import Link from "next/link";
import { SavingsCard } from "@/components/upsell/SavingsCard";
import { NearbyLocations } from "@/components/upsell/NearbyLocations";

export default function Home() {
  const { user, currentStreak, earnedBadges } = useStore();

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
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 uppercase tracking-wider">
              {user.membershipType}
            </span>
            <span className="text-xs text-grey-500">
              {user.primaryLocation}
            </span>
          </div>
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

      {/* What&apos;s Upcoming (New) */}
      <div>
        <h3 className="text-lg font-medium text-teal-900 mb-3 px-1">
          What&apos;s Upcoming
        </h3>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-grey-200 flex gap-4 overflow-x-auto snap-x">
          <div className="min-w-[200px] snap-center">
            <div className="h-24 bg-card-pattern bg-cover rounded-lg mb-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-teal-900/10 group-hover:bg-teal-900/0 transition-colors" />
            </div>
            <p className="font-bold text-sm text-teal-900">Bagel Monday</p>
            <p className="text-xs text-grey-500">
              Mon, 9:00 AM • {user.primaryLocation}
            </p>
          </div>
          <div className="min-w-[200px] snap-center">
            <div className="h-24 bg-card-pattern2 bg-cover rounded-lg mb-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-teal-900/10 group-hover:bg-teal-900/0 transition-colors" />
            </div>
            <p className="font-bold text-sm text-teal-900">Happy Hour</p>
            <p className="text-xs text-grey-500">
              Thu, 4:00 PM • {user.primaryLocation}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Actions Grid - Simplified */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/activity"
          className="bg-white p-5 rounded-xl shadow-sm border border-grey-200 hover:border-teal-900/20 hover:shadow-md transition-all group col-span-2"
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
            Check Your Badges
          </p>
        </Link>
      </div>

      {/* Nearby & Rewards */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-teal-900 pt-2 px-1">Rewards</h3>
        <SavingsCard />
        <NearbyLocations />
      </div>
    </div>
  );
}
