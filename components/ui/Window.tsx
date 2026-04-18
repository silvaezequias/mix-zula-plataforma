"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TabKey, useTabsContext } from "@/providers/TabContext";

export type Tab = {
  id: TabKey;
  label: string;
  href: string;
};

export type WindowProps = {
  tabs: Tab[];
  children: React.ReactNode;
};

export const Window = ({ tabs, children }: WindowProps) => {
  const pathname = usePathname();
  const { isBlocked } = useTabsContext();

  return (
    <div className="lg:col-span-8 space-y-6 w-full h-full">
      <div className="flex border-b border-zinc-800 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const isEnabled = !isBlocked(tab.id);

          const baseClass = clsx(
            "transition-all duration-200 border-b-2 whitespace-nowrap",
            "px-6 py-3 text-xs font-black flex gap-2 items-center uppercase tracking-widest",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50",
            isActive
              ? "border-yellow-500 text-yellow-500 bg-zinc-900/60"
              : isEnabled
                ? "border-transparent text-zinc-500 hover:text-white cursor-pointer hover:bg-zinc-900/30"
                : "border-transparent text-zinc-500 cursor-not-allowed opacity-50",
          );

          if (!isEnabled) {
            return (
              <span key={tab.id} className={baseClass}>
                {tab.label}
              </span>
            );
          }

          return (
            <Link key={tab.id} href={tab.href} className={baseClass}>
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="pt-2 overflow-y-auto custom-scrollbar h-full">
        {children}
      </div>
    </div>
  );
};
