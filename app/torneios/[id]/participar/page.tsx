"use server";

import { redirect } from "next/navigation";
import {
  Trophy,
  Target,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  Zap,
  Info,
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TournamentService } from "@/features/tournament/service";
import { JoinInTournamentButton } from "./JoinInTournamentButton";

export default async function RegistrationPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  const tournament = await TournamentService.findById(params.id);

  if (!tournament) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white uppercase italic">
        <div className="text-center space-y-4">
          <AlertTriangle size={48} className="text-primary mx-auto" />
          <h2 className="text-2xl font-black italic tracking-tighter">
            TORNEIO NÃO LOCALIZADO
          </h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">
            O ID DO TORNEIO É INVÁLIDO OU EXPIRADO
          </p>
          <Link href="/torneios">
            <button className="text-primary hover:text-white transition-colors underline text-xs font-bold mt-4 uppercase">
              Voltar à lista
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect(`/login?redirect=/torneios/${params.id}/participar`);
  }

  if (!session.user.isOnboarded) {
    redirect(`/atualizar-cadastro?redirect=/torneios/${params.id}/participar`);
  }

  const user = session.user;

  const sessionMember = await TournamentService.findParticipantByUserId(
    tournament.id,
    session.user.id,
  );

  if (tournament.status === "CLOSED" && !sessionMember) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white uppercase italic">
        <div className="text-center space-y-4">
          <AlertTriangle size={48} className="text-primary mx-auto" />
          <h2 className="text-2xl font-black italic tracking-tighter">
            ESTE TORNEIO ESTÁ FECHADO
          </h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">
            VOCê NÃO TEM PERMISSÃO DE ACESSAR ESSE TORNEIO
          </p>
          <Link href="/torneios">
            <button className="text-primary hover:text-white transition-colors underline text-xs font-bold mt-4 uppercase">
              Voltar à lista
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const maxPlayers = tournament.totalTeams * tournament.playersPerTeam;
  const currentPlayersCount = tournament.participants.length;
  const isFull = currentPlayersCount >= maxPlayers;

  const isAlreadyParticipant = !!sessionMember;
  const canJoinInTournament =
    isFull && isAlreadyParticipant && tournament.status === "OPEN";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans uppercase italic tracking-widest overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 sm:py-20 animate-in fade-in duration-700">
        <Link href={`/torneios/${tournament.id}`}>
          <div className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-all cursor-pointer mb-10 group w-fit">
            <ChevronLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-[10px] font-black uppercase">
              Ver mais sobre o torneio
            </span>
          </div>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-12">
            <header>
              <div className="inline-block bg-primary text-black px-4 py-1 text-[10px] font-black mb-4 skew-x-[-15deg]">
                <span className="inline-block skew-x-15">
                  CONVITE DE INSCRIÇÃO
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter leading-none mb-6 uppercase">
                {tournament.title}
              </h1>
              <div className="flex flex-wrap gap-8 text-zinc-400">
                <div className="flex items-center gap-3">
                  <Target size={18} className="text-primary" />
                  <span className="text-xs font-black uppercase tracking-tighter">
                    {tournament.gameMode}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy size={18} className="text-primary" />
                  <span className="text-xs font-black uppercase tracking-tighter text-primary">
                    {tournament.prize}
                  </span>
                </div>
              </div>
            </header>

            <section className="bg-[#111] border border-zinc-800 p-8 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-1 bg-primary"></div>
              <div className="flex items-center gap-4">
                <Info size={24} className="text-primary" />
                <h3 className="text-xl font-black uppercase italic tracking-tighter">
                  DESCRIÇÃO DO TORNEIO
                </h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed font-semibold normal-case italic border-l-2 border-zinc-800 pl-6">
                {tournament.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  `Máximo de Agentes: ${maxPlayers}`,
                  `Rounds por Lado: ${tournament.matchesPerMatch}`,
                  `Troca de Lados: ${tournament.swapTeam ? "Habilitado" : "Desabilitado"}`,
                  `${tournament.status === "OPEN" ? "Inscrições Abertas" : "Fechado"}`,
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-black/40 p-3 border border-zinc-900"
                  >
                    <div className="w-1.5 h-1.5 bg-primary transform rotate-45"></div>
                    <span className="text-[10px] text-zinc-300 font-black uppercase">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#111] border-2 border-zinc-800 p-8 sm:p-12 shadow-[0_0_100px_rgba(255,179,0,0.05)] relative overflow-hidden">
              {isAlreadyParticipant ? (
                <div className="text-center space-y-8 py-4 animate-in zoom-in-95">
                  <div className="bg-green-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                    <CheckCircle2 size={48} className="text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-green-500 uppercase italic tracking-tighter">
                      INSCRIÇÃO CONCLUÍDA
                    </h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase">
                      {user.player?.nickname}, VOCÊ ESTÁ INSCRITO NO TORNEIO{" "}
                      <span className="font-black text-white/90">
                        {tournament!.title}
                      </span>
                      !
                    </p>
                  </div>
                  <div className="p-6 bg-zinc-900 border-l-4 border-green-500 text-left">
                    <p className="text-[10px] text-zinc-500 font-black mb-1 uppercase italic">
                      Próxima Fase:
                    </p>
                    <p className="text-xs font-black text-white italic tracking-wider leading-relaxed">
                      Aguarde o processamento da equipe administradora do
                      torneio.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-black mb-1 uppercase">
                        Jogador Logado
                      </p>
                      <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                        {user.player?.nickname}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 font-black mb-1 uppercase">
                        Ocupação
                      </p>
                      <h3
                        className={`text-2xl font-black italic tracking-tighter ${isFull ? "text-red-500" : "text-primary"}`}
                      >
                        {currentPlayersCount}/{maxPlayers}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out ${isFull ? "bg-red-600" : "bg-primary shadow-[0_0_10px_rgba(255,179,0,0.5)]"}`}
                        style={{
                          width: `${(currentPlayersCount / maxPlayers) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">
                      <span>Início das Inscrições</span>
                      <span>Limite de Jogadores</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-zinc-900/30 p-5 border border-zinc-800 group hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap size={16} className="text-primary" />
                        <span className="text-[11px] font-black text-white italic uppercase tracking-widest">
                          Protocolos de Entrada
                        </span>
                      </div>
                      <ul className="space-y-3">
                        <li className="text-[10px] text-zinc-500 font-bold flex justify-between items-center">
                          <span>Login</span>
                          <span className="text-green-500 font-black italic flex items-center gap-1">
                            AUTENTICADO <CheckCircle2 size={10} />
                          </span>
                        </li>
                        <li className="text-[10px] text-zinc-500 font-bold flex justify-between items-center">
                          <span>DISCORD</span>
                          <span className="text-zinc-200 font-black italic uppercase tracking-widest">
                            {user.name}
                          </span>
                        </li>
                        <li className="text-[10px] text-zinc-500 font-bold flex justify-between items-center">
                          <span>NICK REGISTRADO</span>
                          <span className="text-zinc-200 font-black italic uppercase tracking-widest">
                            {user.player?.nickname}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3 ">
                      <JoinInTournamentButton
                        canJoinInTournament={canJoinInTournament}
                        tournamentId={tournament.id}
                        isFull={isFull}
                      />

                      {isFull && (
                        <div className="flex items-center justify-center gap-2 text-red-500 animate-pulse">
                          <AlertTriangle size={12} />
                          <span className="text-[9px] font-black uppercase italic">
                            Limite de vagas atingido para este torneio
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
