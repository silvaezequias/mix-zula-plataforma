import { useEffect, useState } from "react";
import clsx from "clsx";

export type Tab = {
  id: string;
  label: string;
  enabled?: boolean;
  content: React.ReactNode;
};

export type WindowProps = {
  tabs: Tab[];
  focusAtTab: string;
};

export const Window = ({ tabs, focusAtTab }: WindowProps) => {
  const [activeTab, setActiveTab] = useState<string>(
    tabs.some((tab) => tab.id === focusAtTab) ? focusAtTab : tabs[0].id,
  );

  useEffect(() => {
    if (tabs.some((tab) => tab.id === focusAtTab)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(focusAtTab);
    }
  }, [focusAtTab, tabs]);

  return (
    <div className="lg:col-span-8 space-y-6 w-full">
      <div className="flex border-b border-zinc-800 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isEnabled = tab.enabled !== false;

          return (
            <button
              key={tab.id}
              onClick={() => isEnabled && setActiveTab(tab.id)}
              className={clsx(
                "transition-all duration-200 border-b-2 whitespace-nowrap",
                "px-6 py-3 text-xs font-black flex gap-2 items-center uppercase tracking-widest",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50",
                isActive
                  ? "border-yellow-500 text-yellow-500 bg-zinc-900/60"
                  : isEnabled
                    ? "border-transparent text-zinc-500 hover:text-white cursor-pointer hover:bg-zinc-900/30"
                    : "border-transparent text-zinc-500 cursor-not-allowed opacity-50",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="pt-2 md:max-h-[70vh] overflow-y-auto custom-scrollbar">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};
