"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type TabKey =
  | "overview"
  | "participants"
  | "user"
  | "teams"
  | "matches"
  | "staff"
  | "webhooks"
  | "settings";

type UseTabsProps = {
  defaultTab?: TabKey;
  blockedTabs?: TabKey[];
};

const ALL_TABS: TabKey[] = [
  "overview",
  "participants",
  "user",
  "teams",
  "matches",
  "staff",
  "webhooks",
  "settings",
];

export function useTabs({
  defaultTab = "overview",
  blockedTabs = [],
}: UseTabsProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlTab = searchParams.get("tab") as TabKey | null;

  const safeUrlTab = useMemo(() => {
    if (!urlTab || !ALL_TABS.includes(urlTab)) return defaultTab;
    if (blockedTabs.includes(urlTab)) return defaultTab;
    return urlTab;
  }, [urlTab, blockedTabs, defaultTab]);

  const [activeTab, setActiveTab] = useState<TabKey>(safeUrlTab);

  useEffect(() => {
    setActiveTab(safeUrlTab);
  }, [safeUrlTab]);

  function changeTab(tab: TabKey) {
    if (blockedTabs.includes(tab)) return;

    setActiveTab(tab);

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);

      router.replace(`?${params.toString()}`, {
        scroll: false,
      });
    });
  }

  function isActive(tab: TabKey) {
    return activeTab === tab;
  }

  function isBlocked(tab: TabKey) {
    return blockedTabs.includes(tab);
  }

  return {
    activeTab,
    changeTab,
    isActive,
    isBlocked,
    isPending,
  };
}
