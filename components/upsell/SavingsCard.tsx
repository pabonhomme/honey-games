"use client";

import clsx from "clsx";
import { useStore } from "@/lib/store/useStore";

export function SavingsCard() {
  const { upsellOpportunity } = useStore();

  if (!upsellOpportunity || upsellOpportunity.savings <= 0) return null;

  return (
    <div className="bg-gradient-to-br from-grey-80 to-grey-90 p-6 rounded-2xl shadow-sm border border-white">
      <h3 className="font-bold text-grey-10 mb-2">Smart Savings Insight</h3>
      <p className="text-sm text-grey-50 mb-4">
        Based on your {upsellOpportunity.visits} visits this year:
      </p>

      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-xs text-grey-50 uppercase tracking-wide">
            You Spent
          </p>
          <p className="text-2xl font-bold text-sunset-50">
            ${upsellOpportunity.totalSpentOnDayPasses}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-grey-50 uppercase tracking-wide">
            Member Cost
          </p>
          <p className="text-xl font-bold text-teal-50">
            ${upsellOpportunity.potentialMembershipCost}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-grey-50/20">
        <p className="text-sm">
          A monthly membership would have saved you{" "}
          <span className="font-bold text-honey-50">
            ${upsellOpportunity.savings}
          </span>
          .
        </p>
        <button className="mt-3 w-full py-2 bg-teal-50 text-white rounded-lg font-medium text-sm hover:bg-teal-70 transition-colors">
          View Membership Options
        </button>
      </div>
    </div>
  );
}
