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
        "relative p-5 rounded-xl border-2 border-dashed transition-all overflow-hidden",
        isUnlocked
          ? "border-honey-50 bg-honey-90/30"
          : "border-grey-50 bg-grey-90 opacity-70",
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-2xl">🎟️</span>
        {isUnlocked ? (
          <span className="bg-honey-50 text-grey-10 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            Unlocked
          </span>
        ) : (
          <span className="bg-grey-50 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            Locked
          </span>
        )}
      </div>

      <h4 className="font-bold text-grey-10">{title}</h4>
      <p className="text-sm text-sunset-50 font-bold mb-2">{discount}</p>

      {isUnlocked ? (
        <div className="bg-white p-2 rounded text-center font-mono text-sm tracking-widest border border-honey-50">
          {code}
        </div>
      ) : (
        <div className="bg-grey-80 p-2 rounded text-center font-mono text-sm text-transparent select-none blur-sm">
          HIDDENCODE
        </div>
      )}

      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-grey-90/50 backdrop-blur-[1px]">
          <p className="text-xs font-bold text-grey-50 bg-white px-3 py-1 rounded-full shadow-sm">
            Complete 1 more goal
          </p>
        </div>
      )}
    </div>
  );
}
