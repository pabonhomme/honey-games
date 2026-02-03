"use client";

import { useStore } from "@/lib/store/useStore";
import clsx from "clsx";

function StatRow({
  label,
  value,
  icon,
  subtext,
}: {
  label: string;
  value: number | string;
  icon: string;
  subtext?: string;
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
      <span className="text-xl font-light text-teal-700">{value}</span>
    </div>
  );
}

export default function StatsPage() {
  const { stats, mayorStatus } = useStore();

  return (
    <div className="p-5 pt-10 pb-24 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-light text-teal-900 mb-1">Your Stats</h1>
        <p className="text-sm text-grey-500">
          A breakdown of your Industrious activity.
        </p>
      </div>

      {/* Mayor Status Card - Highlight */}
      <div className="bg-teal-900 rounded-xl p-6 shadow-md text-sand relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-teal-700/50 flex items-center justify-center border border-teal-500">
              👑
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                Location Status
              </h3>
              <p className="text-gold-500 text-xs font-bold">Aspiring Bee</p>
            </div>
          </div>

          <p className="text-sm text-white/80 leading-relaxed max-w-[90%]">
            Your top location is{" "}
            <span className="font-semibold text-white">Flatiron</span> with{" "}
            {stats.totalCheckIns} visits.
          </p>
        </div>
        {/* Decor */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

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
        />
        <StatRow
          label="Meeting Rooms"
          value={stats.meetingRoomCount}
          icon="🤝"
          subtext="Hours booked"
        />
        <StatRow
          label="Day Passes"
          value={stats.dayPassCount}
          icon="🎫"
          subtext="Desks used"
        />
      </div>

      <div className="bg-sand border border-gold-500/20 p-5 rounded-xl flex items-start gap-4">
        <div className="text-2xl mt-1">💡</div>
        <div>
          <h3 className="font-bold text-teal-900 text-sm mb-1">
            Did you know?
          </h3>
          <p className="text-xs text-teal-700 leading-relaxed">
            You are in the top 15% of members for meeting room usage this month!
            Considering upgrading to a dedicated office?
          </p>
        </div>
      </div>
    </div>
  );
}
