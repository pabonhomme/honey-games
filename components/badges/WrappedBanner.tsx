"use client";

import Link from "next/link";
import { useStore } from "@/lib/store/useStore";

export function WrappedBanner() {
  const { user } = useStore();

  return (
    <div className="w-full bg-white border border-teal-200/50 rounded-xl p-3 mb-6 relative overflow-hidden shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
      <div className="flex items-center gap-3 z-10 w-full">
        {/* Icon/Brand */}
        <div className="w-8 h-8 rounded-full bg-gold-400/20 text-gold-500 flex items-center justify-center text-xl shrink-0">
          ✨
        </div>

        <div className="flex flex-col flex-grow">
          <p className="text-teal-900 font-bold text-xs leading-tight">
            You’ve been busy! View your Industrious Wrapped recap
          </p>
        </div>

        <Link
          href="/wrapped"
          className="bg-teal-900 text-white text-[10px] font-bold py-2 px-3 rounded-lg hover:bg-teal-800 transition-colors shrink-0"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
