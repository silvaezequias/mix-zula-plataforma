"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Menu, X, Check, AlertTriangle } from "lucide-react";

import {
  Championship,
  ChampSettings,
  ChampStatus,
  Match,
  Player,
  Role,
  Team,
} from "@/types";

import {
  AVAILABLE_ROLES,
  INITIAL_STAFF,
  MOCK_MAPS,
  MOCK_TOURNAMENTS,
} from "@/contansts/data";

// Importação dos componentes separados
import { UserManagementModal } from "@/components/modals/UserManagementModal";
import { ChampionshipDetailView } from "./ChampionshipDetailView";
import { Sidebar } from "@/components/layout/Sidebar";
import { Page } from "@/components/Page";
import { Layout } from "@/components/Layout";
import { Logo } from "@/components/Brand";

/* ===============================================================================
  PÁGINA PRINCIPAL (DETALHES DO TORNEIO)
===============================================================================
*/
export default function TournamentPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params?.id as string;

  // --- ESTADOS DE SESSÃO ---
  const [user, setUser] = useState<Player | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // --- ESTADOS DO CAMPEONATO ---
  const [championships, setChampionships] =
    useState<Championship[]>(MOCK_TOURNAMENTS);
  const [staffList, setStaffList] = useState<Player[]>(INITIAL_STAFF);

  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Player | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // --- VERIFICAÇÃO DE LOGIN (LOCALSTORAGE) ---
  useEffect(() => {
    const savedUser = localStorage.getItem("arena_user");
    if (!savedUser) {
      router.push("/login"); // Redireciona se não houver usuário
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCheckingAuth(false);
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  // --- DADOS COMPUTADOS ---
  const activeChamp = useMemo(
    () => championships.find((c) => c.id === tournamentId) || null,
    [championships, tournamentId],
  );

  const isStaff = useMemo(() => {
    if (!user) return false;
    const staffRoles = ["ADMIN", "MODERADOR", "JUIZ", "STREAMER", "Ajudante"];
    return staffRoles.includes(user.role);
  }, [user]);

  const handleRandomize = () => {
    if (!activeChamp) return;
    updateChampInfo("status", "randomizing");
    setTimeout(() => {
      setChampionships((prev) =>
        prev.map((c) => {
          if (c.id === activeChamp.id) {
            const shuffled = [...c.players].sort(() => 0.5 - Math.random());
            const teams: Team[] = [];
            for (let i = 0; i < c.settings.totalTeams; i++) {
              teams.push({
                id: `team-${i + 1}`,
                name: `EQUIPE ${String.fromCharCode(65 + i)}`,
                players: shuffled.slice(
                  i * c.settings.playersPerTeam,
                  (i + 1) * c.settings.playersPerTeam,
                ),
                side: i % 2 === 0 ? "TR" : "CT",
              });
            }

            const matches: Match[] = [];

            for (let i = 0; i < teams.length; i += 2) {
              matches.push({
                id: "m" + i,
                currentRound: 1,
                order: i,
                phase: 4,
                status: "desligado",
                swappedSides: false,
                teamAId: teams[i].id,
                teamBId: teams[i + 1].id,
              });
            }

            matches[0].status = "iniciado";

            return { ...c, status: "live", teams, matches: matches }; // Inicia as matches se necessário
          }
          return c;
        }),
      );
    }, 3000);
  };

  const updateChampSettings = (
    field: keyof ChampSettings,
    value: number | boolean | string,
  ) => {
    if (!activeChamp) return;
    setChampionships((prev) =>
      prev.map((c) =>
        c.id === activeChamp.id
          ? { ...c, settings: { ...c.settings, [field]: value } }
          : c,
      ),
    );
  };

  const updateChampInfo = (
    field: keyof Championship,
    value: number | boolean | string,
  ) => {
    if (!activeChamp) return;
    setChampionships((prev) =>
      prev.map((c) => (c.id === activeChamp.id ? { ...c, [field]: value } : c)),
    );
  };

  const applyRoleChange = (newRole: Role) => {
    if (!selectedUser) return;
    const roleConfig = AVAILABLE_ROLES.find((r) => r.value === newRole);
    const updatedUser = {
      ...selectedUser,
      role: newRole,
      color: roleConfig?.color,
    };
    setStaffList((prev) => {
      const exists = prev.find((s) => s.id === selectedUser.id);
      if (exists)
        return prev.map((s) => (s.id === selectedUser.id ? updatedUser : s));
      else if (newRole !== "PLAYER") return [...prev, updatedUser];
      return prev;
    });
    setChampionships((prev) =>
      prev.map((c) => ({
        ...c,
        players: c.players.map((p) =>
          p.id === selectedUser.id ? updatedUser : p,
        ),
      })),
    );
    setSelectedUser(updatedUser);
    setShowRoleModal(false);
  };

  if (isCheckingAuth) return null; // Ou um loading spinner

  if (!activeChamp) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white uppercase italic">
        <div className="text-center space-y-4">
          <AlertTriangle size={48} className="text-[#FFB300] mx-auto" />
          <h2 className="text-2xl font-black italic tracking-tighter">
            TORNEIO NÃO LOCALIZADO
          </h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">
            O ID DO TORNEIO É INVÁLIDO OU EXPIRADO
          </p>
          <button
            onClick={() => router.push("/torneios")}
            className="text-[#FFB300] hover:text-white transition-colors underline text-xs font-bold mt-4 uppercase"
          >
            Voltar ao Menu Principal
          </button>
        </div>
      </div>
    );
  }

  return (
    <Page>
      <Layout hideHeader={true}>
        <div className="max-w-480 mx-auto min-h-screen flex flex-col lg:flex-row relative">
          {/* Header Mobile */}

          <div className="lg:hidden bg-[#111] border-b border-zinc-800 p-4 flex justify-between items-center z-50">
            <Logo />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-zinc-800 text-white rounded"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* --- CONTEÚDO PRINCIPAL --- */}
          <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,#111_0%,#050505_100%)] order-2 lg:order-1">
            <div className="hidden lg:flex justify-between h-14 bg-zinc-900/80 backdrop-blur-md items-center px-8 border-b border-zinc-800 sticky top-0 z-40">
              <Logo />{" "}
            </div>

            <div className="p-4 sm:p-6 lg:p-10">
              <ChampionshipDetailView
                players={activeChamp.players}
                tournamentId={tournamentId}
                setChampionships={setChampionships}
                activeChamp={activeChamp}
                isStaff={isStaff}
                onRandomize={handleRandomize}
                onManageUser={(p) => {
                  setSelectedUser(p);
                  setShowUserModal(true);
                }}
              />
            </div>
          </main>

          {/* Sidebar Staff */}
          <Sidebar
            staff={staffList}
            currentUser={user}
            activeChamp={activeChamp}
            isStaff={isStaff}
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onManageUser={(p) => {
              setSelectedUser(p);
              setShowUserModal(true);
            }}
          />
        </div>

        {/* --- MODAIS (REGRAS COM SELECT DE ESTADO) --- */}

        {showRulesModal && (
          <div className="fixed inset-0 z-120 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm uppercase italic">
            <div className="bg-[#111] border-2 border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto uppercase relative shadow-2xl">
              <div className="bg-[#FFB300] p-4 flex justify-between items-center text-black font-black italic sticky top-0 z-10">
                <h3 className="text-lg sm:text-xl uppercase tracking-tighter italic">
                  PARAMETRIZAR MISSÃO
                </h3>
                <button onClick={() => setShowRulesModal(false)}>
                  <X />
                </button>
              </div>

              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4">
                  <h4 className="text-[#FFB300] font-black italic text-[10px] mb-2 uppercase">
                    GERAL
                  </h4>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">
                      NOME DO TORNEIO
                    </label>
                    <input
                      type="text"
                      className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white italic outline-none uppercase"
                      value={activeChamp.name}
                      onChange={(e) => updateChampInfo("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">
                      MAPA ATUAL
                    </label>
                    <select
                      className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white outline-none appearance-none"
                      value={activeChamp.settings.map}
                      onChange={(e) =>
                        updateChampSettings("map", e.target.value)
                      }
                    >
                      {MOCK_MAPS.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[#FFB300] font-black italic text-[10px] mb-2 uppercase">
                    ESTADO & EQUIPES
                  </h4>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">
                      STATUS DO CAMPEONATO
                    </label>
                    <select
                      className="w-full bg-zinc-900 border border-zinc-800 p-2 text-[#FFB300] font-black outline-none appearance-none"
                      value={activeChamp.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as ChampStatus;
                        if (
                          newStatus === "live" &&
                          activeChamp.teams.length === 0
                        )
                          return;
                        updateChampInfo("status", newStatus);
                      }}
                    >
                      <option value="open">INSCRIÇÃO (ABERTO)</option>
                      <option value="setting_teams">DEFININDO EQUIPES</option>
                      <option
                        value="live"
                        disabled={activeChamp.teams.length === 0}
                      >
                        EM ANDAMENTO (LIVE)
                      </option>
                      <option value="finished">FINALIZADO / ENCERRADO</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase">
                        MAX. TIMES
                      </label>
                      <input
                        type="number"
                        className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white outline-none"
                        value={activeChamp.settings.totalTeams}
                        onChange={(e) =>
                          updateChampSettings(
                            "totalTeams",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase">
                        JOG. POR TIME
                      </label>
                      <input
                        type="number"
                        className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white outline-none"
                        value={activeChamp.settings.playersPerTeam}
                        onChange={(e) =>
                          updateChampSettings(
                            "playersPerTeam",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-zinc-900/50 flex justify-end">
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="w-full sm:w-auto bg-[#FFB300] text-black font-black italic px-10 py-3 text-xs uppercase tracking-widest"
                >
                  SALVAR ALTERAÇÕES
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAIS DE BROADCAST & USUÁRIO --- */}
        {/* ... (Modais mantidos conforme versão anterior para brevidade, integrando as mesmas props) ... */}

        {showUserModal && selectedUser && isStaff && (
          <UserManagementModal
            user={selectedUser}
            onClose={() => setShowUserModal(false)}
            onOpenRoleModal={() => setShowRoleModal(true)}
          />
        )}

        {/* Modal de Seleção de Cargo */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 z-160 flex items-center justify-center p-4">
            <div className="bg-black/95 border-2 border-[#FFB300] w-full max-w-sm flex flex-col shadow-2xl animate-in zoom-in-95">
              <div className="bg-[#FFB300] p-4 flex justify-between items-center text-black font-black italic">
                <h3 className="text-lg uppercase">ALTERAR CARGO</h3>
                <button onClick={() => setShowRoleModal(false)}>
                  <X />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar uppercase">
                {AVAILABLE_ROLES.map((roleOption) => (
                  <div
                    key={roleOption.value}
                    onClick={() => applyRoleChange(roleOption.value)}
                    className={`p-4 border border-zinc-800 flex items-center justify-between cursor-pointer transition-all ${selectedUser.role === roleOption.value ? "bg-[#FFB300]/10 border-[#FFB300]" : "bg-zinc-900/50 hover:bg-zinc-800"}`}
                  >
                    <span
                      className={`text-xs font-black italic ${roleOption.color} tracking-widest uppercase`}
                    >
                      {roleOption.label}
                    </span>
                    {selectedUser.role === roleOption.value && (
                      <Check size={16} className="text-[#FFB300]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Layout>
    </Page>
  );
}
