"use client";

import { updateUserAction } from "@/features/user/action";
import { parseDate } from "@/lib/formatter";
import { PayloadUser } from "@/types/next-auth";
import { AlertTriangle, Calendar, ChevronRight, Gamepad2 } from "lucide-react";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

export type UpdateUserFormProps = {
  user: PayloadUser;
};

export const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [playerNickname, setPlayerNickname] = useState(user.player?.nickname);
  const [birthDate, setBirthDate] = useState(user.birthDate);

  const playerNicknameHasChanged = playerNickname !== user.player?.nickname;
  const userBirthHasChanged = birthDate !== user.birthDate;
  const hasChange = playerNicknameHasChanged || userBirthHasChanged;

  const isValidPlayerNickname =
    !!playerNickname &&
    playerNickname.length >= 3 &&
    playerNickname.length <= 20;

  const isValidBirthDate = (() => {
    if (!birthDate) return false;

    const today = new Date();
    const birth = parseDate(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const hasHadBirthdayThisYear =
      today.getMonth() > birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() >= birth.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }

    return age > 10 && age < 100;
  })();

  const canSubmit =
    !isPending && isValidPlayerNickname && isValidBirthDate && hasChange;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerNickname) {
      setError("O seu nome dentro do jogo é obrigatório para a identificação.");
      return;
    }
    if (!birthDate) {
      setError(
        "A data de nascimento é necessária para os protocolos de idade.",
      );
      return;
    }

    startTransition(async () => {
      const result = await updateUserAction({
        birthDate: birthDate,
        playerNickname: playerNickname,
      });

      if (result.success) {
        signIn("discord", { redirect: false });
        setError("");
      } else {
        setError(result.error as string);
      }
    });
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-zinc-500 flex items-center gap-2">
          <Gamepad2 size={14} className="text-primary" /> Nome (NICK IN-GAME) *
        </label>
        <input
          type="text"
          name="playerNickname"
          placeholder="EX: GHOST_STRIKE"
          value={playerNickname}
          onChange={(e) => setPlayerNickname(e.target.value.replace(/ /g, ""))}
          className="w-full bg-[#1a1a1a] border border-zinc-800 p-4 text-xs font-black italic text-white outline-none focus:border-primary transition-all placeholder:text-zinc-700"
        />
      </div>

      <div className="gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 flex items-center gap-2">
            <Calendar size={14} className="text-primary" /> DATA DE NASCIMENTO *
          </label>
          <input
            type="date"
            name="birthDate"
            value={birthDate || "0000-00-00"}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-zinc-800 p-4 text-xs font-black italic text-white outline-none focus:border-primary transition-all scheme-dark"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
          <AlertTriangle size={16} className="text-red-500" />
          <span className="text-[10px] font-black text-red-500 uppercase italic tracking-tight leading-tight">
            {error}
          </span>
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full font-black py-5 text-sm tracking-[0.4em] transition-all flex items-center justify-center gap-4 uppercase italic
          ${
            canSubmit
              ? "bg-primary text-black hover:brightness-110 shadow-[0_10px_30px_rgba(255,179,0,0.15)] active:scale-[0.98] border-b-4 border-black/20"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed border-zinc-700"
          }`}
        >
          {isPending ? (
            <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
          ) : (
            <>
              Atualizar <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
