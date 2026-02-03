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
        "flex flex-col items-center justify-center py-3 px-2 transition-all active:scale-95",
        isActive ? "text-teal-50" : "text-grey-50 hover:text-teal-70",
      )}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span
        className={clsx("text-xs font-medium", isActive ? "font-bold" : "")}
      >
        {label}
      </span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-grey-80 safe-area-inset-bottom z-50 rounded-t-2xl shadow-header">
      <div className="grid grid-cols-4 max-w-md mx-auto">
        <NavItem icon="🏠" label="Home" href="/" isActive={pathname === "/"} />
        <NavItem
          icon="🏆"
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
