"use client";

import { LogOut } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { ActionButton } from "../ui/ActionButton";

export const UserMenu = ({ session }: { session: Session }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="relative h-full flex items-center">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className={`flex items-center gap-3 h-full transition-all group border-x border-transparent `}
      >
        <div className="flex flex-col items-end leading-none">
          <span className="text-sm font-black italic text-white uppercase tracking-tighter">
            {session.user.name}
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
            {session.user.player?.nickname}
          </span>
        </div>
        <div className="w-10 h-10 bg-[#FFB300] flex items-center justify-center text-black font-black text-sm border border-zinc-800 shadow-lg transform transition-transform group-hover:scale-105">
          {session.user.name?.charAt(0).toUpperCase()}
        </div>
      </button>

      {showUserMenu && (
        <div className="ml-2 z-50 w-max">
          <ActionButton
            onClick={() => signOut()}
            intent="danger"
            className="z-60 flex items-center justify-between gap-3 px-0 transition-all w-7.5 text-[10px] font-black italic uppercase tracking-[0.2em]"
          >
            <span className="hidden lg:inline-block">ENCERRAR SESSÃO</span>
            <span className="hidden sm:inline-block lg:hidden">SAIR</span>
            <LogOut
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </ActionButton>
        </div>
      )}
    </div>
  );
};
