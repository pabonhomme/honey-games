"use client";

import clsx from "clsx";

interface CouponProps {
  title: string;
  discount: string;
  code: string;
  isUnlocked: boolean;
}

export function CouponCard({ title, discount, code, isUnlocked }: CouponProps) {
  return (
    <div
      className={clsx(
        "relative p-5 rounded-xl border transition-all overflow-hidden h-full flex flex-col justify-between group",
        isUnlocked
          ? "bg-sand border-gold-500/50 hover:border-gold-500 shadow-sm"
          : "bg-grey-100 border-transparent opacity-80 grayscale",
      )}
    >
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl filter drop-shadow-sm">🎟️</span>
          {isUnlocked ? (
            <span className="bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Active
            </span>
          ) : (
            <span className="bg-grey-200 text-grey-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Locked
            </span>
          )}
        </div>

        <h4 className="font-bold text-teal-900 text-sm leading-tight mb-1">
          {title}
        </h4>
        <p className="text-xs text-teal-700 font-medium mb-3">{discount}</p>
      </div>

      {isUnlocked ? (
        <div className="bg-white border border-dashed border-grey-200 p-2 rounded text-center font-mono text-xs tracking-widest text-teal-900 select-all cursor-pointer hover:bg-grey-50 transition-colors">
          {code}
        </div>
      ) : (
        <div className="bg-grey-200 p-2 rounded text-center font-mono text-xs text-transparent select-none blur-[2px]">
          LOCKED
        </div>
      )}

      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-grey-100/50 backdrop-blur-[1px]">
          <span className="text-[10px] font-bold text-teal-900 bg-white px-3 py-1.5 rounded-full shadow-sm border border-grey-200">
            Keep Checking In
          </span>
        </div>
      )}
    </div>
  );
}
