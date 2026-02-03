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
      content: "Your year in review.",
      icon: "🎁",
      style: "intro",
    },
    {
      title: "Consistently Present",
      value: stats.totalCheckIns,
      label: "Total Check-ins",
      content: "You showed up and made it happen.",
      icon: "📍",
      style: "stat",
    },
    {
      title: "Meeting Guru",
      value: stats.meetingRoomCount,
      label: "Meetings Hosted",
      content: "Collaboration looks good on you.",
      icon: "🤝",
      style: "stat",
    },
    {
      title: "Explorer",
      value: stats.locationsVisited,
      label: "Locations Visited",
      content: "Expanding your horizons.",
      icon: "🌍",
      style: "stat",
    },
    {
      title: "Achiever",
      value: earnedBadges.length,
      label: "Badges Earned",
      content: "Collecting wins along the way.",
      icon: "🏆",
      style: "stat",
    },
    {
      title: "Smart Saver",
      value: `$${Math.round(stats.dayPassCount * 45)}`,
      label: "Value Utilized",
      content: "Maximizing your membership value.",
      icon: "💰",
      style: "stat", // Gold accent
    },
  ];

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const slide = slides[currentSlide];

  return (
    <div
      className="h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-teal-900 cursor-pointer"
      onClick={nextSlide}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-teal-900">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(29,88,89,0.3),_transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 animate-fade-in space-y-8 max-w-xs mx-auto">
        <div className="w-24 h-24 mx-auto rounded-full bg-teal-700/30 border border-teal-500/30 flex items-center justify-center text-5xl shadow-lg backdrop-blur-sm">
          {slide.icon}
        </div>

        <div>
          {slide.style === "stat" && slide.value !== undefined && (
            <div className="mb-2">
              <p className="text-teal-500 text-xs font-bold uppercase tracking-widest mb-2">
                {slide.label}
              </p>
              <div className="text-6xl font-light text-white tracking-tight">
                {slide.value}
              </div>
            </div>
          )}

          <h2
            className={clsx(
              "font-bold text-white mb-2",
              slide.style === "intro" ? "text-4xl" : "text-2xl",
            )}
          >
            {slide.title}
          </h2>
          <p className="text-teal-200 text-lg font-light leading-relaxed">
            {slide.content}
          </p>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute top-8 left-0 right-0 px-8 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={clsx(
              "h-1 rounded-full flex-1 transition-all duration-300",
              i <= currentSlide ? "bg-gold-500" : "bg-teal-700/50",
            )}
          />
        ))}
      </div>

      <p className="absolute bottom-8 text-xs text-teal-500 font-bold uppercase tracking-widest animate-pulse">
        Tap to continue
      </p>
    </div>
  );
}
