import { PayloadUser } from "@/types/next-auth";
import { AlertTriangle, ChevronRight, ShieldCheck } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BsDiscord } from "react-icons/bs";

export type LoginUserFormProps = {
  loading: boolean;
  setLoading: (bool: boolean) => void;
};

export const LoginUserForm = ({ loading, setLoading }: LoginUserFormProps) => {
  const { data: session, status } = useSession();
  const [messageError, setError] = useState<string | null>(null);

  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isOnboarded = !!session?.user?.isOnboarded;

  const discordData: PayloadUser | null = session?.user ?? null;

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const safeRedirect =
    redirectUrl && redirectUrl.startsWith("/") ? redirectUrl : "/";
  const redirectBeforeUserUpdateUrl = `/atualizar-cadastro/?redirect=${encodeURIComponent(safeRedirect)}`;

  const handleFinalLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated)
      return setError("Conecte seu Discord antes de prosseguir.");
    if (!isOnboarded) return setError("Preencha sua ficha para prosseguir.");

    router.push(safeRedirect);
  };

  return (
    <form onSubmit={handleFinalLogin} className="space-y-8">
      <div className="space-y-4">
        <StepLabel number="1" title="AUTENTICAÇÃO DE SEGURANÇA" />
        <DiscordSection
          discordData={discordData}
          loading={loading}
          onSignIn={() => {
            setLoading(true);
            signIn("discord", { callbackUrl: safeRedirect });
          }}
        />
      </div>

      <div className="space-y-4">
        <StepLabel number="2" title="Credenciais de Segurança" />
        <div className="relative group">
          <button
            type="button"
            onClick={() => {
              if (isAuthenticated && !isOnboarded) {
                router.push(redirectBeforeUserUpdateUrl);
              }
            }}
            disabled={loading}
            className={`w-full bg-primary text-black hover:brightness-110 font-black py-4 px-6 flex items-center justify-center gap-3 transition-all active:scale-95 group ${
              (!isAuthenticated || isOnboarded) &&
              "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700 active:scale-0"
            }`}
          >
            <span className="text-xs tracking-widest uppercase">
              {isAuthenticated
                ? isOnboarded
                  ? "Cadastro Atualizado"
                  : "Atualize seu cadastro"
                : "Conecte sua Conta antes"}
            </span>
          </button>
        </div>
      </div>

      {messageError && (
        <div className="bg-red-500/10 border border-red-500/50 p-3 flex items-center gap-3 animate-shake">
          <AlertTriangle size={14} className="text-red-500" />
          <span className="text-[9px] font-black text-red-500 uppercase">
            {messageError}
          </span>
        </div>
      )}
      <div className="pt-4">
        <button
          type="submit"
          className={`w-full font-black py-5 text-sm tracking-[0.4em] transition-all flex items-center justify-center gap-3 uppercase italic
                  ${
                    !isOnboarded
                      ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700"
                      : "bg-primary text-black hover:brightness-110 shadow-[0_10px_20px_rgba(255,179,0,0.15)] active:scale-[0.98]"
                  }`}
        >
          CONTINUAR <ChevronRight size={18} />
        </button>
      </div>
    </form>
  );
};
const StepLabel = ({ number, title }: { number: string; title: string }) => (
  <label className="text-[10px] font-black text-zinc-500 flex items-center gap-2 uppercase">
    <span className="w-4 h-4 rounded-full bg-zinc-800 text-[8px] flex items-center justify-center text-zinc-400">
      {number}
    </span>
    {title}
  </label>
);

const DiscordSection = ({
  discordData,
  loading,
  onSignIn,
}: {
  discordData: PayloadUser | null;
  loading: boolean;
  onSignIn: () => void;
}) => {
  if (!discordData) {
    return (
      <button
        type="button"
        onClick={onSignIn}
        disabled={loading}
        className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-black py-4 px-6 flex items-center justify-center gap-3 transition-all active:scale-95 group"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <BsDiscord size={18} />
            <span className="text-xs tracking-widest uppercase">
              Conectar com Discord
            </span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="bg-zinc-900 border border-green-500/50 p-4 flex items-center justify-between animate-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-green-500/10 flex items-center justify-center text-green-500 rounded-full">
          <ShieldCheck size={18} />
        </div>
        <div>
          <p className="text-[10px] text-zinc-500 font-bold leading-none">
            CONECTADO COMO
          </p>
          <p className="text-xs font-black text-white italic mt-1">
            {discordData.name}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => signOut()}
        className="text-[8px] font-black text-zinc-600 hover:text-red-500 transition-colors"
      >
        SAIR
      </button>
    </div>
  );
};
