"use client";

import { Logo } from "@/components/Brand";
import { useMobileMenuOpen } from "@/providers/MobileMenuContext";
import { Menu, X } from "lucide-react";

export function TournamentHeader() {
  const { isOpen, toggle } = useMobileMenuOpen();

  return (
    <>
      <div className="lg:hidden flex justify-between p-4 bg-[#111]">
        <Logo />
        <button onClick={() => toggle()}>{isOpen ? <X /> : <Menu />}</button>
      </div>
      <div className="hidden lg:flex justify-between h-14 bg-[#111] items-center px-8 top-0 z-40 ">
        <Logo />{" "}
      </div>
    </>
  );
}
