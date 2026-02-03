"use client";

import { useStore } from "@/lib/store/useStore";

export function SavingsCard() {
  const { upsellOpportunity } = useStore();

  if (!upsellOpportunity || upsellOpportunity.savings <= 0) return null;

  return (
    <div className="bg-teal-900 text-sand p-6 rounded-xl shadow-md border border-teal-700 relative overflow-hidden group">
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-teal-500 text-xs font-bold uppercase tracking-widest mb-1">
          Smart Savings
        </h3>
        <p className="text-sm opacity-90 mb-4">
          Based on your {upsellOpportunity.visits} visits this year:
        </p>

        <div className="flex justify-between items-end mb-4 border-b border-teal-700 pb-4">
          <div>
            <p className="text-xs text-teal-500 uppercase tracking-wide mb-1">
              You Spent
            </p>
            <p className="text-2xl font-light text-white">
              ${upsellOpportunity.totalSpentOnDayPasses}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-teal-500 uppercase tracking-wide mb-1">
              Member Cost
            </p>
            <p className="text-xl font-light text-white/90">
              ${upsellOpportunity.potentialMembershipCost}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm">
            Potential Savings:{" "}
            <span className="font-bold text-gold-500">
              ${upsellOpportunity.savings}
            </span>
          </p>
          <button className="text-xs font-bold bg-white text-teal-900 px-4 py-2 rounded-lg hover:bg-grey-100 transition-colors">
            View Options
          </button>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
    </div>
  );
}
