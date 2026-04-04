"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Menu, X, Check, AlertTriangle } from "lucide-react";

import { Championship, Match, Role, Team } from "@/types";
import { AVAILABLE_ROLES, MOCK_TOURNAMENTS } from "@/contansts/data";

import { UserManagementModal } from "@/components/modals/UserManagementModal";
import { ChampionshipDetailView } from "./ChampionshipDetailView";
import { Sidebar } from "@/components/layout/Sidebar";
import { Page } from "@/components/Page";
import { Layout } from "@/components/Layout";
import { Logo } from "@/components/Brand";
import { useSession } from "next-auth/react";
import { PayloadUser } from "@/types/next-auth";

export default function TournamentPage() {
  const params = useParams();
  const router = useRouter();

  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";

  const tournamentId = params?.id as string;

  const [championships, setChampionships] =
    useState<Championship[]>(MOCK_TOURNAMENTS);
  const [staffList, setStaffList] = useState<PayloadUser[]>([]);

  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<PayloadUser | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const activeChamp = useMemo(
    () => championships.find((c) => c.id === tournamentId) || null,
    [championships, tournamentId],
  );

  const isStaff = true;

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(
        `/login/?redirect=${encodeURIComponent(window.location.href)}`,
      );
    }
  }, [router, status]);

  if (!isAuthenticated) return null;

  if (!activeChamp) {
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
          <button
            onClick={() => router.push("/torneios")}
            className="text-primary hover:text-white transition-colors underline text-xs font-bold mt-4 uppercase"
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
            currentUser={session.user}
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

        {showUserModal && selectedUser && isStaff && (
          <UserManagementModal
            user={selectedUser}
            onClose={() => setShowUserModal(false)}
            onOpenRoleModal={() => setShowRoleModal(true)}
          />
        )}

        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 z-160 flex items-center justify-center p-4">
            <div className="bg-black/95 border-2 border-primary w-full max-w-sm flex flex-col shadow-2xl animate-in zoom-in-95">
              <div className="bg-primary p-4 flex justify-between items-center text-black font-black italic">
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
                    className={`p-4 border border-zinc-800 flex items-center justify-between cursor-pointer transition-all ${/*selectedUser.role /**/ "ADMIN" === roleOption.value ? "bg-primary/10 border-primary" : "bg-zinc-900/50 hover:bg-zinc-800"}`}
                  >
                    <span
                      className={`text-xs font-black italic ${roleOption.color} tracking-widest uppercase`}
                    >
                      {roleOption.label}
                    </span>
                    {
                      /*selectedUser.role /**/ "ADMIN" === roleOption.value && (
                        <Check size={16} className="text-primary" />
                      )
                    }
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
