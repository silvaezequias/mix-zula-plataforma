import { AlertTriangle, Calendar, ChevronRight, Gamepad2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export type UpdateUserFormProps = {
  playerNickname: string;
  birthDate: string;
  messageError: string | null;
  canSubmit: boolean;
  loading: boolean;
  apiResponseStatus: number;
  handleUpdate: (e: React.FormEvent) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
};

export const UpdateUserForm = ({
  birthDate,
  playerNickname,
  messageError,
  canSubmit,
  loading,
  apiResponseStatus,
  handleInputChange,
  handleUpdate,
}: UpdateUserFormProps) => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const safeRedirect = redirectUrl || "/";
  const redirectBeforeLoginUrl = `/login/?redirect=${encodeURIComponent(safeRedirect)}`;

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(redirectBeforeLoginUrl);
    }
  }, [redirectBeforeLoginUrl, router, safeRedirect, status]);

  useEffect(() => {
    if (apiResponseStatus === 200) {
      signIn("discord", {
        redirect: true,
        callbackUrl: redirectBeforeLoginUrl,
      });
    }
  }, [apiResponseStatus, redirectBeforeLoginUrl, safeRedirect]);

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
          onChange={handleInputChange}
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
            value={birthDate}
            onChange={handleInputChange}
            className="w-full bg-[#1a1a1a] border border-zinc-800 p-4 text-xs font-black italic text-white outline-none focus:border-primary transition-all scheme-dark"
          />
        </div>
      </div>

      {messageError && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
          <AlertTriangle size={16} className="text-red-500" />
          <span className="text-[10px] font-black text-red-500 uppercase italic tracking-tight leading-tight">
            {messageError}
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
          {loading ? (
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
