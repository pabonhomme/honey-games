"use client";

import { useStore } from "@/lib/store/useStore";

function StatRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-grey-10 font-medium">{label}</span>
      </div>
      <span className="text-xl font-bold text-teal-50">{value}</span>
    </div>
  );
}

export default function StatsPage() {
  const { stats } = useStore();

  return (
    <div className="p-6 pt-12 pb-24 space-y-6">
      <h1 className="text-3xl font-bold">Your Stats</h1>
      <p className="text-grey-50">A breakdown of your Industrious activity.</p>

      <div className="space-y-3">
        <StatRow
          label="Total Check-ins"
          value={stats.totalCheckIns}
          icon="📍"
        />
        <StatRow
          label="Locations Visited"
          value={stats.locationsVisited}
          icon="🌍"
        />
        <StatRow
          label="Meeting Rooms"
          value={stats.meetingRoomCount}
          icon="🤝"
        />
        <StatRow label="Day Passes" value={stats.dayPassCount} icon="🎫" />
      </div>

      {/* Mayor Status Card */}
      <div className="bg-gradient-to-r from-grey-90 to-white p-6 rounded-2xl border border-grey-80">
        <h3 className="font-bold text-grey-10 mb-2 flex items-center">
          <span className="text-2xl mr-2">👑</span>
          Location Status
        </h3>
        <p className="text-sm text-grey-50 mb-3">
          Your most visited location is{" "}
          <span className="font-semibold text-teal-50">Flatiron</span> with{" "}
          {stats.totalCheckIns} visits.
        </p>
        <div className="text-xs bg-honey-50/20 text-honey-50 font-bold px-3 py-1 rounded-full inline-block">
          Current Status: Aspiring Bee
        </div>
      </div>

      <div className="bg-honey-90 p-6 rounded-2xl mt-4">
        <h3 className="font-bold text-honey-50 mb-2">Did you know?</h3>
        <p className="text-sm text-grey-50">
          You are in the top 15% of members for meeting room usage this month!
        </p>
      </div>
    </div>
  );
}
