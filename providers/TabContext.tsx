"use client";

import { createContext, useContext, useState } from "react";
import { useTabs } from "@/hooks/useTabs";

export type TabKey =
  | "overview"
  | "participants"
  | "teams"
  | "user"
  | "matches"
  | "staff"
  | "webhooks"
  | "settings";

type TabsContextType = ReturnType<typeof useTabs> & {
  blockTab: (tab: TabKey) => void;
  unblockTab: (tab: TabKey) => void;
  setBlockedTabs: (tabs: TabKey[]) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

export function TabsProvider({
  children,
  initialBlockedTabs = [],
}: {
  children: React.ReactNode;
  initialBlockedTabs?: TabKey[];
}) {
  const [blockedTabs, setBlockedTabsState] =
    useState<TabKey[]>(initialBlockedTabs);

  const tabs = useTabs({ blockedTabs });

  function blockTab(tab: TabKey) {
    setBlockedTabsState((prev) => (prev.includes(tab) ? prev : [...prev, tab]));
  }

  function unblockTab(tab: TabKey) {
    setBlockedTabsState((prev) => prev.filter((t) => t !== tab));
  }

  function setBlockedTabs(tabs: TabKey[]) {
    setBlockedTabsState(tabs);
  }

  return (
    <TabsContext.Provider
      value={{
        ...tabs,
        blockTab,
        unblockTab,
        setBlockedTabs,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export function useTabsContext() {
  const ctx = useContext(TabsContext);

  if (!ctx) {
    throw new Error("useTabsContext precisa estar dentro do TabsProvider");
  }

  return ctx;
}
