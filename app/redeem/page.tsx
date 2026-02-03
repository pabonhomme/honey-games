"use client";

import { useStore } from "@/lib/store/useStore";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { toast, Toaster } from "sonner";

// Mock Shop Items
const SHOP_ITEMS = [
  {
    id: "mug",
    name: "Industrious Mug",
    cost: 300,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "bottle",
    name: "Water Bottle",
    cost: 500,
    image:
      "https://images.unsplash.com/photo-1602143407151-11115cd4e69b?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "tote",
    name: "Canvas Tote",
    cost: 450,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "notebook",
    name: "Premium Notebook",
    cost: 250,
    image:
      "https://images.unsplash.com/photo-1531346878377-a513bc950613?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "hoodie",
    name: "Member Hoodie",
    cost: 1200,
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "daypass",
    name: "Guest Day Pass",
    cost: 800,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200&h=200",
  },
];

export default function RedeemPage() {
  const { user, redeemItem } = useStore();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "affordable">("all");
  const [isRedeeming, setIsRedeeming] = useState(false);

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (filter === "affordable") return (user.activityPoints || 0) >= item.cost;
    return true;
  });

  const handleRedeem = async () => {
    if (!selectedItem) return;
    const item = SHOP_ITEMS.find((i) => i.id === selectedItem);
    if (!item) return;

    setIsRedeeming(true);
    const success = await redeemItem(item);
    setIsRedeeming(false);

    if (success) {
      toast.success(`Redeemed ${item.name}!`);
      setSelectedItem(null);
    } else {
      toast.error("Insufficient points or error occurred.");
    }
  };

  return (
    <div className="p-5 pt-10 pb-32 space-y-6">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/activity"
          className="text-2xl text-grey-400 hover:text-teal-900 transition-colors"
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-light text-teal-900 leading-tight">
            Redeem your points
          </h1>
          <p className="text-sm text-grey-500">Treat yourself to some swag.</p>
        </div>
      </div>

      {/* Balance */}
      <div className="bg-sand border border-gold-400/30 rounded-xl p-4 flex justify-between items-center shadow-sm">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-900">
          Your Balance
        </span>
        <span className="text-3xl font-light text-teal-900">
          {user.activityPoints || 0} pts
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={clsx(
            "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all border",
            filter === "all"
              ? "bg-teal-900 text-white border-teal-900"
              : "bg-white text-grey-500 border-grey-200",
          )}
        >
          All Items
        </button>
        <button
          onClick={() => setFilter("affordable")}
          className={clsx(
            "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all border",
            filter === "affordable"
              ? "bg-teal-900 text-white border-teal-900"
              : "bg-white text-grey-500 border-grey-200",
          )}
        >
          Available to purchase
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const canAfford = (user.activityPoints || 0) >= item.cost;
          const isSelected = selectedItem === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={clsx(
                "group relative bg-white rounded-xl overflow-hidden border transition-all cursor-pointer",
                isSelected
                  ? "border-gold-500 ring-2 ring-gold-200 shadow-md"
                  : "border-grey-200 hover:border-teal-900/30",
                !canAfford && "opacity-60 grayscale",
              )}
            >
              <div className="aspect-square relative overflow-hidden bg-grey-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3">
                <p className="font-bold text-teal-900 text-sm">{item.name}</p>
                <p
                  className={clsx(
                    "text-xs font-semibold mt-1",
                    canAfford ? "text-gold-600" : "text-red-400",
                  )}
                >
                  {item.cost} pts
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-md border-t border-grey-200 safe-area-inset-bottom z-40">
        <div className="max-w-md mx-auto">
          <button
            disabled={
              !selectedItem ||
              isRedeeming ||
              (user.activityPoints || 0) <
                (SHOP_ITEMS.find((i) => i.id === selectedItem)?.cost || 99999)
            }
            onClick={handleRedeem}
            className="w-full bg-teal-900 text-white h-12 rounded-lg font-bold text-sm hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isRedeeming ? "Redeeming..." : "Redeem Item"}
          </button>
        </div>
      </div>
    </div>
  );
}
