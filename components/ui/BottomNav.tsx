"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

function NavItem({
  icon,
  label,
  href,
  isActive,
}: {
  icon: string;
  label: string;
  href: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "group flex flex-col items-center justify-center py-2 px-4 w-full transition-all duration-300 relative",
        isActive ? "text-teal-900" : "text-grey-500 hover:text-teal-700",
      )}
    >
      {/* Icon Area */}
      <div
        className={clsx(
          "mb-1 text-2xl transition-transform duration-300",
          isActive ? "scale-110" : "group-hover:scale-110",
        )}
      >
        {icon}
      </div>

      {/* Label */}
      <span
        className={clsx(
          "text-[10px] uppercase tracking-wider font-semibold transition-opacity duration-300",
          isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100",
        )}
      >
        {label}
      </span>

      {/* Active Dot Indicator */}
      {isActive && (
        <span className="absolute bottom-1 w-1 h-1 bg-teal-900 rounded-full animate-fade-in" />
      )}
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-grey-200 safe-area-inset-bottom z-50">
      <div className="grid grid-cols-4 max-w-md mx-auto h-16 items-center">
        <NavItem icon="⌂" label="Home" href="/" isActive={pathname === "/"} />
        <NavItem
          icon="⬡"
          label="Badges"
          href="/badges"
          isActive={pathname === "/badges"}
        />
        <NavItem
          icon="📊"
          label="Stats"
          href="/stats"
          isActive={pathname === "/stats"}
        />
        <NavItem
          icon="🎁"
          label="Wrapped"
          href="/wrapped"
          isActive={pathname === "/wrapped"}
        />
      </div>
    </nav>
  );
}
