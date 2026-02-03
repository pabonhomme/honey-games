"use client";

import { useStore } from "@/lib/store/useStore";
import clsx from "clsx";
import { useState } from "react";

export default function WrappedPage() {
  const { stats, earnedBadges } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "2024 Wrapped",
      content: "Let's review your year at Industrious.",
      icon: "🎁",
      bg: "from-teal-50 to-teal-90",
    },
    {
      title: "Total Check-ins",
      value: stats.totalCheckIns,
      content: "You showed up and made it happen!",
      icon: "📍",
      bg: "from-ocean-50 to-ocean-90",
    },
    {
      title: "Meeting Room Guru",
      value: stats.meetingRoomCount,
      content: "Meetings hosted.",
      icon: "🤝",
      bg: "from-honey-50 to-honey-90",
    },
    {
      title: "New Horizons",
      value: stats.locationsVisited,
      content: "Locations visited this year.",
      icon: "🌍",
      bg: "from-sunset-50 to-sunset-90",
    },
    {
      title: "Badge Collector",
      value: earnedBadges.length,
      content: "Badges earned.",
      icon: "🏆",
      bg: "from-teal-90 to-ocean-50",
    },
    {
      title: "Smart Saver",
      value: `$${Math.round(stats.dayPassCount * 45)}`, // Mock calc
      content: "Value utilized in workspace access.",
      icon: "💰",
      bg: "from-honey-70 to-sunset-70",
    },
  ];

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);

  const slide = slides[currentSlide];

  return (
    <div
      className={clsx(
        "h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center p-8 text-white text-center transition-colors duration-500 bg-gradient-to-b relative overflow-hidden",
        slide.bg,
      )}
      onClick={nextSlide}
    >
      <div className="animate-fade-in space-y-4 z-10">
        <div className="text-8xl mb-6">{slide.icon}</div>

        {slide.value !== undefined && (
          <div className="text-8xl font-black mb-2">{slide.value}</div>
        )}

        <h2 className="text-4xl font-bold">{slide.title}</h2>
        <p className="text-xl opacity-90">{slide.content}</p>
      </div>

      <div className="absolute bottom-10 flex space-x-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={clsx(
              "w-2 h-2 rounded-full transition-all",
              i === currentSlide ? "bg-white w-6" : "bg-white/40",
            )}
          />
        ))}
      </div>

      <p className="absolute bottom-4 text-xs opacity-60">Tap to continue</p>
    </div>
  );
}
