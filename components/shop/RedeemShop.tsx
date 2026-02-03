"use client";

import { useStore } from "@/lib/store/useStore";
import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

type ShopItem = {
  id: string;
  name: string;
  cost: number;
  image: string;
};

const SHOP_ITEMS: ShopItem[] = [
  {
    id: "mug",
    name: "Industrious Mug",
    cost: 300,
    image: "/mug.png",
  },
  {
    id: "bottle",
    name: "Industrious Water bottle",
    cost: 1000,
    image: "/bottle.png",
  },
  {
    id: "hoodie",
    name: "Industrious Hoodie",
    cost: 10000,
    image: "/sweater.png",
  },
];

export function RedeemShop() {
  const { user, redeemItem } = useStore();
  const [filter, setFilter] = useState<"all" | "available">("all");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (filter === "available") {
      return (user.activityPoints || 0) >= item.cost;
    }
    return true;
  });

  const handleRedeem = async () => {
    if (!selectedItem) return;
    const item = SHOP_ITEMS.find((i) => i.id === selectedItem);
    if (!item) return;

    if ((user.activityPoints || 0) < item.cost) {
      alert("Not enough points!");
      return;
    }

    setIsRedeeming(true);
    const success = await redeemItem(item);
    if (success) {
      setSelectedItem(null); // Deselect after success
    } else {
      alert("Redemption failed");
    }
    setIsRedeeming(false);
  };

  return (
    <div className="space-y-4 relative">
      {/* Header Section for Shop */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-teal-900">Redeem your points</h2>
        <div className="bg-grey-100 rounded-lg p-1 text-[10px] font-bold text-teal-900 px-3 py-1">
          {user.activityPoints || 0} points
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex gap-2">
        {(["all", "available"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${
              filter === f
                ? "border-teal-900 bg-transparent text-teal-900"
                : "border-transparent bg-grey-100 text-grey-500 hover:bg-grey-200"
            }`}
          >
            {f === "all" ? "All" : "Available to purchase"}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="space-y-3 pb-20">
        {filteredItems.map((item) => {
          const isSelected = selectedItem === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={clsx(
                "rounded-xl p-4 flex items-center justify-between shadow-sm border transition-all cursor-pointer",
                isSelected
                  ? "border-gold-400 bg-sand/30 ring-1 ring-gold-400"
                  : "bg-white border-grey-200 hover:border-gold-200",
              )}
            >
              <div className="flex flex-col">
                <h3 className="text-teal-900 font-bold text-sm">{item.name}</h3>
                <p className="text-grey-500 text-xs mt-1">{item.cost} pts</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 relative rounded-md overflow-hidden bg-grey-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Redeem Button */}
      {selectedItem && (
        <div className="fixed bottom-20 left-4 right-4 z-40 animate-fade-in-up">
          <button
            onClick={handleRedeem}
            disabled={isRedeeming}
            className="w-full bg-teal-900 text-white rounded-xl py-3.5 font-bold text-sm shadow-lg hover:bg-teal-800 transition-colors disabled:opacity-70 flex justify-center items-center"
          >
            {isRedeeming ? "Redeeming..." : "Redeem Selected Item"}
          </button>
        </div>
      )}
    </div>
  );
}
