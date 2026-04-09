import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
  Lock,
  Zap,
} from "lucide-react";
import { StaffRole } from "./StaffArea";
import { useState, useTransition } from "react";
import { PayloadUser } from "@/types/next-auth";
import { createTournamentRoleRequestAction } from "@/features/tournament/action";
import { FullTournament } from "@/types";
import { ParticipantRole } from "@prisma/client";
import { useRouter } from "next/navigation";

export const RequestStaffRole = ({
  user,
  availableRoles,
  tournament,
}: {
  availableRoles: StaffRole[];
  user: PayloadUser;
  tournament: FullTournament;
}) => {
  const [error, setError] = useState<string | undefined>();
  const [selectedRole, setSelectedRole] = useState<ParticipantRole | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleApply = () => {
    if (!selectedRole) return;

    setError(undefined);

    startTransition(async () => {
      const result = await createTournamentRoleRequestAction(
        tournament.id,
        selectedRole,
      );

      if (result.success)
        router.push(`/torneios/${tournament.id}/staff/resultado`);
      else setError(result.error);
    });
  };

  return (
    <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-24 animate-in fade-in duration-700">
      <header className="mb-20 text-center space-y-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-zinc-800"></div>
          <div className="bg-primary p-2 transform -rotate-12 shadow-[0_0_20px_rgba(255,179,0,0.2)]">
            <Lock size={20} className="text-black" />
          </div>
          <div className="h-px w-12 bg-zinc-800"></div>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter leading-none uppercase">
          RECRUTAMENTO <span className="text-primary">STAFF</span>
        </h1>

        <p className="text-zinc-500 font-bold max-w-2xl mx-auto text-sm leading-relaxed uppercase">
          Você está na área de recrutamento para equipe de staff do respectivo
          torneio. Escolha seu cargo de interesse e envie sua solicitação de
          entrada.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-[10px] font-black text-zinc-500 tracking-[0.4em] mb-6 flex items-center gap-3">
            <Zap size={14} className="text-primary" /> SELECIONE A SUA
            ESPECIALIDADE
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableRoles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`text-left p-6 border-2 transition-all group relative overflow-hidden ${
                  selectedRole === role.id
                    ? "bg-[#111] border-primary shadow-[0_0_30px_rgba(255,179,0,0.1)] scale-[1.02]"
                    : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div
                  className={`${role.color} mb-4 group-hover:scale-110 transition-transform`}
                >
                  {role.icon}
                </div>
                <h4 className="text-lg font-black italic tracking-tighter uppercase mb-2">
                  {role.title}
                </h4>
                <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">
                  {role.description}
                </p>

                {selectedRole === role.id && (
                  <div className="absolute top-2 right-2 text-primary">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-12 p-8 bg-[#111] border-l-4 border-primary space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-primary">
              <Info size={18} />
              <h4 className="text-xs font-black uppercase tracking-widest">
                Protocolo de Solicitação
              </h4>
            </div>
            <p className="text-[10px] text-zinc-400 font-bold leading-loose uppercase">
              Ao candidatar-se, a sua solicitação será enviada para o sistema e
              passará por uma análise do administrador desse torneio. Membros da
              Staff possuem acesso a ferramentas de controle interno e paineis
              de moderção
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 sticky top-32">
          <div className="bg-[#111] border border-zinc-800 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-1 bg-primary"></div>

            <h3 className="text-xl font-black italic tracking-tighter uppercase mb-8">
              Confirmar Alistamento
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase italic">
                  Identificação
                </label>
                <div className="w-full bg-[#050505] border border-zinc-800 p-4 text-xs font-black italic text-zinc-400 uppercase">
                  {user.name}{" "}
                  <span className="text-white/30 text-[10px]">
                    {user.player?.nickname}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase italic">
                  Cargo Solicitado
                </label>
                <div
                  className={`w-full bg-[#050505] border border-zinc-800 p-4 text-xs font-black italic uppercase ${selectedRole ? "text-primary" : "text-zinc-700"}`}
                >
                  {selectedRole ? selectedRole : "NENHUMA SELECIONADA"}
                </div>
              </div>
              <div className="pt-6 flex flex-col gap-5">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                    <AlertTriangle size={16} className="text-red-500" />
                    <span className="text-[10px] font-black text-red-500 uppercase italic tracking-tight leading-tight">
                      {error}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleApply}
                  disabled={!selectedRole || isPending}
                  className={`w-full font-black py-6 text-sm tracking-widest transition-all flex items-center justify-center gap-4 uppercase italic
                  ${
                    !selectedRole || isPending
                      ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                      : "bg-primary text-black hover:brightness-110 shadow-[0_10px_30px_rgba(255,179,0,0.15)] active:scale-[0.95]"
                  }`}
                >
                  {isPending ? (
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>
                      ENVIAR SOLICITAÇÃO <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[8px] text-zinc-700 font-bold text-center uppercase tracking-widest mt-4">
                A aprovação depende da análise do administrador desse torneio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
