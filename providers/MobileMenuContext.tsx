"use client";

import { createContext, useContext, useState, useCallback } from "react";

type MobileMenuContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const MobileMenuContext = createContext<MobileMenuContextType | null>(null);

export function MobileMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <MobileMenuContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenuOpen() {
  const context = useContext(MobileMenuContext);

  if (!context) {
    throw new Error("useMobileMenuOpen must be used within MobileMenuProvider");
  }

  return context;
}
