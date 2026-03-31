import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Users,
  Settings,
  LogOut,
  Shield,
  Trash2,
  Ban,
  Clock,
  ChevronRight,
  RotateCcw,
  Target,
  LayoutGrid,
  Activity,
  X,
  UserMinus,
  MessageSquareOff,
  Radio,
  Tv,
  Search,
  ExternalLink,
  Globe,
  Play,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";

const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  USER: "user",
};

// --- Geração de Dados Fictícios ---
const generateMockPlayers = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i + 1}`,
    discordName: `Usuario_${i + 1}`,
    discordId: `1234567890${i}`,
    gameNick: `ProPlayer_${i + 1}`,
    role: ROLES.USER,
  }));
};

const MOCK_STAFF = [
  { id: "s1", name: "ZulaMaster", role: "ADMIN", color: "text-red-500" },
  {
    id: "s2",
    name: "DarkCaster",
    role: "STREAMER",
    color: "text-purple-500",
    bio: "Narrador oficial de FPS",
  },
  { id: "s3", name: "Mod_Shadow", role: "MODERADOR", color: "text-green-500" },
  { id: "s4", name: "Ref_Strike", role: "JUIZ", color: "text-blue-500" },
  {
    id: "s5",
    name: "MixStreamer",
    role: "STREAMER",
    color: "text-purple-500",
    bio: "Especialista em táticas",
  },
];

const MOCK_PLAYERS = generateMockPlayers(20);

const App = () => {
  // --- Estados de Autenticação ---
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [discordInput, setDiscordInput] = useState("");
  const [nickInput, setNickInput] = useState("");

  // --- Estados do Campeonato ---
  const [view, setView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("inscritos");
  const [searchTerm, setSearchTerm] = useState("");
  const [championships, setChampionships] = useState([
    {
      id: "1",
      name: "TORNEIO DE ABERTURA: SEASON 1",
      prize: "R$ 5.000 + SKIN EXCLUSIVA",
      status: "open", // open, randomizing, finished, live
      players: MOCK_PLAYERS,
      teams: [],
      broadcast: {
        platform: "MIX",
        link: "",
        time: "20:00",
        streamerId: "",
      },
      settings: {
        playersPerTeam: 5,
        totalTeams: 4,
        rounds: 15,
        sideSwap: true,
        gameMode: "FPS / DEFUSE",
      },
    },
  ]);
  const [selectedChampionshipId, setSelectedChampionshipId] = useState(null);

  // --- Estados de Modais ---
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showStreamerDropdown, setShowStreamerDropdown] = useState(false);

  const activeChamp = championships.find(
    (c) => c.id === selectedChampionshipId,
  );

  // Buscar dados do streamer selecionado
  const selectedStreamer = useMemo(() => {
    if (!activeChamp?.broadcast?.streamerId) return null;
    return MOCK_STAFF.find((s) => s.id === activeChamp.broadcast.streamerId);
  }, [activeChamp?.broadcast?.streamerId]);

  const streamersList = useMemo(
    () => MOCK_STAFF.filter((s) => s.role === "STREAMER"),
    [],
  );

  // Filtro de Jogadores para Admin
  const filteredPlayers = useMemo(() => {
    if (!activeChamp) return [];
    return activeChamp.players.filter(
      (p) =>
        p.gameNick.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.discordName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [activeChamp, searchTerm]);

  // --- Handlers ---
  const handleLogin = () => {
    if (!discordInput || !nickInput) return;
    setUser({
      id: "me-1",
      discordName: discordInput,
      discordId: "987654321",
      gameNick: nickInput,
      role: discordInput.toLowerCase().includes("admin")
        ? ROLES.ADMIN
        : ROLES.USER,
    });
    setShowLoginModal(false);
  };

  const updateChampSettings = (field, value) => {
    setChampionships((prev) =>
      prev.map((c) => {
        if (c.id === activeChamp.id) {
          return { ...c, settings: { ...c.settings, [field]: value } };
        }
        return c;
      }),
    );
  };

  const updateChampInfo = (field, value) => {
    setChampionships((prev) =>
      prev.map((c) => {
        if (c.id === activeChamp.id) {
          return { ...c, [field]: value };
        }
        return c;
      }),
    );
  };

  const updateBroadcast = (field, value) => {
    setChampionships((prev) =>
      prev.map((c) => {
        if (c.id === activeChamp.id) {
          return { ...c, broadcast: { ...c.broadcast, [field]: value } };
        }
        return c;
      }),
    );
  };

  const startRandomization = () => {
    setActiveTab("teams");
    updateChampInfo("status", "randomizing");

    setTimeout(() => {
      setChampionships((prev) =>
        prev.map((c) => {
          if (c.id === activeChamp.id) {
            const shuffled = [...c.players].sort(() => 0.5 - Math.random());
            const teams = [];
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
            return { ...c, status: "finished", teams };
          }
          return c;
        }),
      );
    }, 5000);
  };

  const startTournament = () => {
    if (activeChamp.status !== "finished") return;
    updateChampInfo("status", "live");
  };

  const maxPlayers = activeChamp
    ? activeChamp.settings.totalTeams * activeChamp.settings.playersPerTeam
    : 0;
  const waitlistCount = activeChamp
    ? Math.max(0, activeChamp.players.length - maxPlayers)
    : 0;

  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans uppercase text-white">
        <div className="bg-[#111] border-t-4 border-[#FFB300] p-10 w-full max-w-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-8 bg-[#FFB300] transform skew-x-[30deg] translate-x-16 -translate-y-2"></div>
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white p-2 mb-4">
              <Trophy className="text-black w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter">
              PLATAFORMA ARENA
            </h1>
            <p className="text-zinc-500 text-[10px] font-bold tracking-[0.2em]">
              IDENTIFICAÇÃO NECESSÁRIA
            </p>
          </div>
          <div className="space-y-6">
            <input
              type="text"
              className="w-full bg-[#1a1a1a] border border-zinc-800 p-3 text-white outline-none focus:border-[#FFB300]"
              placeholder="USUARIO#0000"
              value={discordInput}
              onChange={(e) => setDiscordInput(e.target.value)}
            />
            <input
              type="text"
              className="w-full bg-[#1a1a1a] border border-zinc-800 p-3 text-white outline-none focus:border-[#FFB300]"
              placeholder="NICK NO JOGO"
              value={nickInput}
              onChange={(e) => setNickInput(e.target.value)}
            />
            <button
              onClick={handleLogin}
              className="w-full border-2 border-[#FFB300] text-[#FFB300] hover:bg-[#FFB300] hover:text-black font-black py-4 transition-all italic"
            >
              ENTRAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-row font-sans overflow-hidden">
      {/* --- Main Content --- */}
      <main className="flex-1 overflow-y-auto border-r border-zinc-900 bg-[radial-gradient(circle_at_top_left,_#111_0%,_#050505_100%)]">
        <div className="h-14 bg-zinc-900/80 backdrop-blur-md flex items-center px-8 border-b border-zinc-800">
          <div className="flex gap-6 text-[10px] font-black tracking-widest italic h-full items-center uppercase">
            <span className="text-[#FFB300] border-b-2 border-[#FFB300] h-full flex items-center px-2 cursor-pointer uppercase">
              CAMPEONATOS
            </span>
            <span className="text-zinc-500 hover:text-white cursor-pointer transition-colors uppercase">
              RANKINGS
            </span>
          </div>
        </div>

        <div className="p-10">
          {view === "dashboard" ? (
            <div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-10">
                TORNEIOS ATIVOS
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {championships.map((champ) => (
                  <div
                    key={champ.id}
                    className="bg-[#111] border-l-4 border-zinc-800 p-8 hover:border-[#FFB300] transition-all group"
                  >
                    <h3 className="text-3xl font-black italic mb-2 tracking-tighter">
                      {champ.name}
                    </h3>
                    <p className="text-zinc-500 text-xs font-bold mb-8 uppercase italic">
                      {champ.prize}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedChampionshipId(champ.id);
                        setView("championship_detail");
                      }}
                      className="bg-zinc-800 px-8 py-4 text-xs font-black italic group-hover:bg-[#FFB300] group-hover:text-black transition-all uppercase"
                    >
                      GERENCIAR CAMPEONATO
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setView("dashboard")}
                  className="text-zinc-500 hover:text-[#FFB300] font-black italic flex items-center gap-2 text-xs uppercase"
                >
                  <RotateCcw size={14} /> VOLTAR AO LOBBY
                </button>
                {user.role === ROLES.ADMIN &&
                  activeChamp.status !== "randomizing" &&
                  activeChamp.status !== "live" && (
                    <button
                      onClick={startRandomization}
                      className="bg-[#FFB300] text-black px-10 py-3 font-black italic text-sm shadow-[4px_4px_0_#996b00] active:translate-y-1 active:shadow-none transition-all uppercase"
                    >
                      {activeChamp.status === "finished"
                        ? "RE-SORTEAR EQUIPES"
                        : "SORTEAR EQUIPES"}
                    </button>
                  )}
                {activeChamp.status === "live" && (
                  <span className="bg-green-600 text-black px-6 py-2 font-black italic text-sm uppercase flex items-center gap-2">
                    <Radio size={16} className="animate-pulse" /> TORNEIO EM
                    ANDAMENTO
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-4">
                  {/* Navegação de Abas */}
                  <div className="flex border-b border-zinc-800">
                    <button
                      onClick={() =>
                        activeChamp.status !== "randomizing" &&
                        setActiveTab("inscritos")
                      }
                      disabled={activeChamp.status === "randomizing"}
                      className={`px-8 py-3 text-xs font-black italic tracking-widest transition-all border-b-2 ${activeTab === "inscritos" ? "border-[#FFB300] text-[#FFB300] bg-zinc-900/50" : "border-transparent text-zinc-500 hover:text-white"} ${activeChamp.status === "randomizing" ? "opacity-20" : ""}`}
                    >
                      INSCRITOS
                    </button>
                    <button
                      onClick={() =>
                        activeChamp.status !== "open" && setActiveTab("teams")
                      }
                      className={`px-8 py-3 text-xs font-black italic tracking-widest transition-all border-b-2 ${activeTab === "teams" ? "border-[#FFB300] text-[#FFB300] bg-zinc-900/50" : "border-transparent text-zinc-500 hover:text-white"} ${activeChamp.status === "open" ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      EQUIPES{" "}
                      {(activeChamp.status === "open" ||
                        activeChamp.status === "randomizing") && (
                        <Clock className="inline ml-2" size={12} />
                      )}
                    </button>
                  </div>

                  {/* Busca */}
                  {user.role === ROLES.ADMIN && activeTab === "inscritos" && (
                    <div className="relative group">
                      <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FFB300] transition-colors"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="BUSCAR JOGADOR POR NICK OU DISCORD..."
                        className="w-full bg-zinc-900/50 border border-zinc-800 p-4 pl-12 text-xs font-black italic outline-none focus:border-[#FFB300] transition-all uppercase"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="pt-4">
                    {activeTab === "inscritos" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredPlayers.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setSelectedUser(p);
                              setShowUserModal(true);
                            }}
                            className="bg-zinc-900/50 border border-zinc-800 p-4 flex items-center justify-between group hover:border-[#FFB300]/50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center text-[#FFB300] font-black border border-zinc-700">
                                {p.gameNick.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-black italic text-white uppercase">
                                  {p.gameNick}
                                </p>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                                  @{p.discordName}
                                </p>
                              </div>
                            </div>
                            <span className="text-[9px] font-bold text-zinc-700 uppercase group-hover:text-[#FFB300]">
                              DETALHES
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : activeChamp.status === "randomizing" ? (
                      <div className="py-32 text-center bg-[#111] border border-zinc-800 relative overflow-hidden uppercase">
                        <div className="absolute inset-0 bg-[#FFB300]/5 animate-pulse"></div>
                        <div className="w-16 h-16 border-4 border-[#FFB300] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h4 className="text-3xl font-black italic tracking-tighter text-[#FFB300]">
                          RANDOMIZANDO EQUIPES
                        </h4>
                        <p className="text-zinc-500 text-[10px] font-bold mt-2 uppercase tracking-[0.5em] italic">
                          Calculando balanceamento técnico...
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 uppercase">
                        {activeChamp.teams.map((team) => (
                          <div
                            key={team.id}
                            className="bg-zinc-900 border-t-2 border-[#FFB300]"
                          >
                            <div
                              className={`p-3 flex justify-between items-center ${team.side === "TR" ? "bg-orange-950/30" : "bg-blue-950/30"}`}
                            >
                              <h4 className="font-black italic uppercase tracking-tighter text-lg">
                                {team.name}
                              </h4>
                              <span
                                className={`text-[10px] font-black px-3 py-1 ${team.side === "TR" ? "bg-orange-600" : "bg-blue-600"}`}
                              >
                                {team.side}
                              </span>
                            </div>
                            <div className="p-4 space-y-2">
                              {team.players.map((p) => (
                                <div
                                  key={p.id}
                                  onClick={() => {
                                    setSelectedUser(p);
                                    setShowUserModal(true);
                                  }}
                                  className="flex items-center justify-between bg-black/40 p-2 border border-zinc-800 hover:border-[#FFB300]/50 cursor-pointer group"
                                >
                                  <span className="text-xs font-bold italic group-hover:text-[#FFB300]">
                                    {p.gameNick}
                                  </span>
                                  <span className="text-[9px] text-zinc-700 font-bold uppercase">
                                    PERFIL
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Coluna Lateral */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-[#111] border border-zinc-800 p-6 uppercase">
                    <h4 className="text-[10px] font-black text-[#FFB300] tracking-widest mb-6 italic flex items-center gap-2 uppercase">
                      <Settings size={14} /> RESUMO
                    </h4>
                    <div className="space-y-4 text-[10px] font-bold border-b border-zinc-800 pb-6 mb-6">
                      <div className="flex justify-between uppercase">
                        <span className="text-zinc-500">PLAYERS EM CAMPO</span>
                        <span>{maxPlayers}</span>
                      </div>
                      <div className="flex justify-between uppercase">
                        <span className="text-zinc-500">LISTA DE ESPERA</span>
                        <span className="text-orange-500 italic">
                          {waitlistCount}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowRulesModal(true)}
                      className="w-full bg-[#FFB300] text-black font-black italic py-3 text-xs tracking-widest hover:brightness-110 transition-all uppercase italic"
                    >
                      CONFIGURAR REGRAS
                    </button>
                  </div>

                  {user.role === ROLES.ADMIN && (
                    <div className="bg-red-950/10 border border-red-900/30 p-6 space-y-4 uppercase">
                      <h4 className="text-[10px] font-black text-red-500 tracking-widest italic flex items-center gap-2 uppercase">
                        <Shield size={14} /> GESTÃO DE EVENTO
                      </h4>

                      <div className="space-y-2">
                        <button
                          onClick={startTournament}
                          disabled={
                            activeChamp.status === "open" ||
                            activeChamp.status === "randomizing" ||
                            activeChamp.status === "live"
                          }
                          className={`w-full flex items-center justify-center gap-2 p-3 font-black italic text-xs tracking-widest transition-all uppercase ${activeChamp.status === "finished" ? "bg-green-600 text-white hover:bg-green-500 shadow-[0_0_15px_rgba(22,163,74,0.3)]" : "bg-zinc-800 text-zinc-600 cursor-not-allowed"}`}
                        >
                          <Play size={14} />{" "}
                          {activeChamp.status === "live"
                            ? "TORNEIO JÁ INICIADO"
                            : "INICIAR TORNEIO"}
                        </button>

                        {activeChamp.status === "open" && (
                          <p className="text-[8px] text-zinc-500 font-bold italic text-center uppercase">
                            Sorteie os times para habilitar o início
                          </p>
                        )}

                        <button
                          onClick={() => setShowBroadcastModal(true)}
                          className="w-full bg-zinc-900 text-white border border-zinc-800 font-black italic p-3 text-xs tracking-widest hover:bg-zinc-800 transition-all uppercase flex items-center justify-center gap-2"
                        >
                          <Radio size={14} className="text-[#FFB300]" /> AJUSTAR
                          TRANSMISSÃO
                        </button>

                        <button className="w-full text-left p-3 bg-zinc-950 text-red-500 text-[10px] font-black italic border border-zinc-800 hover:bg-red-600 hover:text-white transition-all uppercase flex items-center gap-2">
                          <Trash2 size={14} /> ABORTAR CAMPEONATO
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- Sidebar Staff --- */}
      <aside className="w-72 bg-[#0a0a0a] flex flex-col border-l border-zinc-900 z-10 uppercase">
        <div className="p-8 border-b border-zinc-900 mb-6 bg-[#FFB300] text-black">
          <h2 className="font-black italic text-2xl tracking-tighter leading-none mb-1 uppercase">
            ARENA
          </h2>
          <p className="font-black text-[9px] tracking-[0.3em] opacity-80 italic uppercase">
            COMANDO & LIVE
          </p>
        </div>

        <div className="px-6 flex-1 overflow-y-auto">
          <h4 className="text-[10px] font-black text-zinc-500 tracking-[0.2em] mb-6 flex items-center gap-2 italic uppercase">
            <Shield size={12} className="text-[#FFB300]" /> EQUIPE TÉCNICA
          </h4>
          <div className="space-y-4 mb-10">
            {MOCK_STAFF.map((staff) => (
              <div
                key={staff.id}
                className="bg-zinc-900/30 border-l-2 border-zinc-800 p-3 hover:bg-zinc-900 transition-colors"
              >
                <span className="text-xs font-black italic text-white block uppercase">
                  {staff.name}
                </span>
                <span
                  className={`text-[9px] font-black italic ${staff.color} tracking-widest uppercase`}
                >
                  {staff.role}
                </span>
              </div>
            ))}
          </div>

          {/* Card de Transmissão */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 relative overflow-hidden group uppercase">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Tv size={40} />
            </div>
            <div className="flex items-center gap-2 text-[#FFB300] mb-4">
              <Radio
                size={14}
                className={
                  activeChamp?.status === "live" ? "animate-pulse" : ""
                }
              />
              <span className="text-[10px] font-black italic uppercase">
                TRANSMISSÃO AO VIVO
              </span>
            </div>

            {activeChamp?.broadcast?.link && selectedStreamer ? (
              <div className="space-y-4 relative">
                <div className="flex items-center gap-3 bg-black/40 p-2 border border-zinc-800">
                  <div className="w-10 h-10 bg-[#FFB300] flex items-center justify-center text-black shadow-lg">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase leading-none">
                      STREAMER
                    </p>
                    <p className="text-xs font-black italic text-white truncate w-32 uppercase">
                      {selectedStreamer.name}
                    </p>
                    <p className="text-[8px] text-[#FFB300] font-black italic mt-1 uppercase">
                      VERIFICADO
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-end px-1">
                  <div>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase leading-none">
                      INÍCIO
                    </p>
                    <p className="text-xs font-black italic text-white uppercase">
                      {activeChamp.broadcast.time || "AGORA"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-zinc-500 font-bold uppercase leading-none">
                      VIA
                    </p>
                    <span className="text-[10px] font-black text-[#FFB300] italic uppercase">
                      {activeChamp.broadcast.platform}
                    </span>
                  </div>
                </div>
                <a
                  href={
                    activeChamp.broadcast.link.startsWith("http")
                      ? activeChamp.broadcast.link
                      : `https://${activeChamp.broadcast.link}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#FFB300] text-black font-black italic py-3 text-[10px] tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all uppercase mt-2 shadow-[0_4px_15px_rgba(255,179,0,0.2)]"
                >
                  ABRIR LIVE <ExternalLink size={12} />
                </a>
              </div>
            ) : (
              <p className="text-[9px] text-zinc-600 font-bold uppercase italic text-center py-4 uppercase">
                Aguardando definição de live
              </p>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-zinc-900 mt-auto">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-3 py-4 text-zinc-600 hover:text-red-500 transition-all text-[10px] font-black italic tracking-widest uppercase"
          >
            LOGOUT DA ARENA
          </button>
        </div>
      </aside>

      {/* --- MODAIS --- */}

      {/* Modal de Transmissão (Broadcast) */}
      {showBroadcastModal && activeChamp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm uppercase">
          <div className="bg-[#111] border-2 border-[#FFB300] w-full max-w-md shadow-2xl relative overflow-visible">
            <div className="bg-[#FFB300] p-4 flex justify-between items-center text-black font-black italic">
              <h3 className="text-xl uppercase tracking-tighter">
                AJUSTES DE TRANSMISSÃO
              </h3>
              <button onClick={() => setShowBroadcastModal(false)}>
                <X />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-zinc-500 block mb-1 uppercase italic">
                    PLATAFORMA
                  </label>
                  <select
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white italic outline-none focus:border-[#FFB300] text-xs appearance-none cursor-pointer"
                    value={activeChamp.broadcast.platform}
                    onChange={(e) =>
                      updateBroadcast("platform", e.target.value)
                    }
                  >
                    <option value="MIX">PLATAFORMA: MIX</option>
                    <option value="TWITCH">PLATAFORMA: TWITCH</option>
                    <option value="YOUTUBE">PLATAFORMA: YOUTUBE</option>
                    <option value="KICK">PLATAFORMA: KICK</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-zinc-500 block mb-1 uppercase italic">
                    HORÁRIO
                  </label>
                  <input
                    type="time"
                    className="w-full bg-zinc-900 border border-zinc-800 p-[10px] text-white italic outline-none focus:border-[#FFB300] text-xs"
                    value={activeChamp.broadcast.time}
                    onChange={(e) => updateBroadcast("time", e.target.value)}
                  />
                </div>
              </div>

              {/* Seletor de Streamer (Staff) */}
              <div className="relative">
                <label className="text-[9px] font-bold text-zinc-500 block mb-1 uppercase italic">
                  MARCAR STREAMER RESPONSÁVEL
                </label>
                <div
                  onClick={() => setShowStreamerDropdown(!showStreamerDropdown)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white italic text-xs flex justify-between items-center cursor-pointer hover:border-[#FFB300] transition-colors"
                >
                  <span
                    className={
                      selectedStreamer ? "text-white" : "text-zinc-600"
                    }
                  >
                    {selectedStreamer
                      ? selectedStreamer.name
                      : "SELECIONE O STREAMER..."}
                  </span>
                  <ChevronDown
                    size={14}
                    className={
                      showStreamerDropdown
                        ? "rotate-180 transition-transform"
                        : "transition-transform"
                    }
                  />
                </div>

                {showStreamerDropdown && (
                  <div className="absolute z-[70] top-full left-0 w-full bg-[#1a1a1a] border border-zinc-800 mt-1 shadow-2xl max-h-48 overflow-y-auto">
                    {streamersList.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          updateBroadcast("streamerId", s.id);
                          setShowStreamerDropdown(false);
                        }}
                        className="p-3 hover:bg-[#FFB300] hover:text-black cursor-pointer transition-colors border-b border-zinc-800/50 flex justify-between items-center"
                      >
                        <span className="text-xs font-black italic">
                          {s.name}
                        </span>
                        <span className="text-[8px] font-bold uppercase opacity-60 italic">
                          {s.bio}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[9px] font-bold text-zinc-500 block mb-1 uppercase italic">
                  LINK DIRETO DA LIVE
                </label>
                <div className="relative">
                  <Globe
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                    size={14}
                  />
                  <input
                    type="text"
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 pl-10 text-white italic outline-none focus:border-[#FFB300] text-xs"
                    placeholder="URL DA TRANSMISSÃO"
                    value={activeChamp.broadcast.link}
                    onChange={(e) => updateBroadcast("link", e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={() => setShowBroadcastModal(false)}
                className="w-full bg-[#FFB300] text-black font-black italic py-4 text-xs tracking-widest hover:brightness-110 transition-all uppercase italic shadow-[0_4px_15px_rgba(255,179,0,0.3)]"
              >
                PUBLICAR TRANSMISSÃO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Regras */}
      {showRulesModal && activeChamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm uppercase">
          <div className="bg-[#111] border-2 border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#FFB300] p-4 flex justify-between items-center text-black font-black italic">
              <h3 className="text-xl uppercase tracking-tighter">
                REGRAS DO EVENTO
              </h3>
              <button onClick={() => setShowRulesModal(false)}>
                <X />
              </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[#FFB300] font-black italic text-[10px] mb-4 uppercase italic">
                  IDENTIFICAÇÃO
                </h4>
                <input
                  type="text"
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white italic outline-none uppercase"
                  value={activeChamp.name}
                  onChange={(e) => updateChampInfo("name", e.target.value)}
                  disabled={activeChamp.status !== "open"}
                />
                <input
                  type="text"
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 text-white italic outline-none uppercase"
                  value={activeChamp.prize}
                  onChange={(e) => updateChampInfo("prize", e.target.value)}
                  disabled={activeChamp.status !== "open"}
                />
              </div>
              <div className="space-y-4">
                <h4 className="text-[#FFB300] font-black italic text-[10px] mb-4 uppercase italic">
                  LOGÍSTICA
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    className="bg-zinc-900 border border-zinc-800 p-2 text-white italic outline-none uppercase"
                    value={activeChamp.settings.rounds}
                    onChange={(e) =>
                      updateChampSettings("rounds", parseInt(e.target.value))
                    }
                    disabled={activeChamp.status !== "open"}
                  />
                  <input
                    type="number"
                    className="bg-zinc-900 border border-zinc-800 p-2 text-white italic outline-none uppercase"
                    value={activeChamp.settings.totalTeams}
                    onChange={(e) =>
                      updateChampSettings(
                        "totalTeams",
                        parseInt(e.target.value),
                      )
                    }
                    disabled={activeChamp.status !== "open"}
                  />
                </div>
                <button
                  onClick={() =>
                    updateChampSettings(
                      "sideSwap",
                      !activeChamp.settings.sideSwap,
                    )
                  }
                  className={`w-full p-2 font-black italic text-[10px] border ${activeChamp.settings.sideSwap ? "bg-green-600 border-green-500" : "bg-red-600 border-red-500"} uppercase`}
                  disabled={activeChamp.status !== "open"}
                >
                  {activeChamp.settings.sideSwap
                    ? "TROCA LADO: ATIVA"
                    : "TROCA LADO: DESATIVA"}
                </button>
              </div>
            </div>
            <div className="p-8 bg-zinc-900/50 flex justify-end">
              <button
                onClick={() => setShowRulesModal(false)}
                className="bg-[#FFB300] text-black font-black italic px-10 py-3 text-xs uppercase tracking-widest italic"
              >
                CONCLUIR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Jogador */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm uppercase">
          <div className="bg-[#111] border-2 border-zinc-800 w-full max-w-md overflow-hidden">
            <div className="bg-zinc-900 p-6 border-b border-zinc-800 relative">
              <button
                onClick={() => setShowUserModal(false)}
                className="absolute top-4 right-4 text-zinc-600 hover:text-white"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#FFB300] text-black text-2xl font-black italic flex items-center justify-center border-4 border-zinc-800 shadow-xl">
                  {selectedUser.gameNick.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black italic text-white tracking-tighter uppercase">
                      {selectedUser.discordName}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-bold opacity-60 italic uppercase">
                      #{selectedUser.discordId}
                    </span>
                  </div>
                  <span className="text-[#FFB300] text-xs font-black italic tracking-widest uppercase">
                    JOGADOR: {selectedUser.gameNick}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-4 uppercase">
              <h4 className="text-[10px] font-black text-zinc-500 tracking-widest mb-4 italic uppercase">
                CONTROLE DE AGENTE
              </h4>
              <button className="w-full flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 hover:border-[#FFB300] transition-colors group">
                <span className="flex items-center gap-3 text-xs font-black italic uppercase">
                  <Shield size={16} className="text-[#FFB300]" /> PROMOVER A
                  STAFF
                </span>
                <ChevronRight size={14} className="text-zinc-700" />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 p-4 bg-orange-950/20 border border-orange-900/50 text-orange-500 hover:bg-orange-600 hover:text-white transition-all text-[10px] font-black italic uppercase">
                  <UserMinus size={14} /> EXPULSAR
                </button>
                <button className="flex items-center justify-center gap-2 p-4 bg-red-950/20 border border-red-900/50 text-red-500 hover:bg-red-600 hover:text-white transition-all text-[10px] font-black italic uppercase">
                  <Ban size={14} /> BANIR
                </button>
              </div>
              <button className="w-full flex items-center justify-center gap-3 p-4 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-white transition-colors text-[10px] font-black italic uppercase">
                <MessageSquareOff size={14} /> SILENCIAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
