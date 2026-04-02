import { Championship, Player, Role } from "@/types";

export const AVAILABLE_ROLES: { label: string; value: Role; color: string }[] =
  [
    { label: "ADMINISTRADOR", value: "ADMIN", color: "text-red-500" },
    { label: "MODERADOR", value: "MODERADOR", color: "text-green-500" },
    { label: "JUIZ", value: "JUIZ", color: "text-blue-500" },
    { label: "STREAMER", value: "STREAMER", color: "text-purple-500" },
    { label: "AJUDANTE", value: "AJUDANTE", color: "text-emerald-500" },
    { label: "JOGADOR COMUM", value: "PLAYER", color: "text-zinc-400" },
  ];

export const INITIAL_STAFF: Player[] = [
  {
    id: "s1",
    gameNick: "MK Noia",
    discordName: "MK Noia",
    discordId: "0001",
    role: "ADMIN",
    color: "text-red-500",
    stats: { kills: 0, deaths: 0, assists: 0 },
    roundStats: [],
  },
  {
    id: "s2_1",
    gameNick: "Bingola",
    discordName: "Bingola",
    discordId: "0003",
    role: "MODERADOR",
    color: "text-green-500",
    bio: "Especialista em Suporte",
    stats: { kills: 0, deaths: 0, assists: 0 },
    roundStats: [],
  },
  {
    id: "s4",
    gameNick: "Will Cabeça de pica",
    discordName: "Will Cabeça de pica",
    discordId: "0005",
    role: "JUIZ",
    color: "text-blue-500",
    stats: { kills: 0, deaths: 0, assists: 0 },
    roundStats: [],
  },
  {
    id: "s3",
    gameNick: "Wz careca",
    discordName: "Wz careca",
    discordId: "0004",
    role: "AJUDANTE",
    color: "text-emerald-500",
    stats: { kills: 0, deaths: 0, assists: 0 },
    roundStats: [],
  },
  {
    id: "s2",
    gameNick: "Lelelelex",
    discordName: "Lelelelex",
    discordId: "0002",
    role: "STREAMER",
    color: "text-purple-500",
    bio: "Moderador de Campeonatos",
    stats: { kills: 0, deaths: 0, assists: 0 },
    roundStats: [],
  },
  {
    id: "s5",
    gameNick: "Alguem pra streamar",
    discordName: "Alguem pra streamar",
    discordId: "0006",
    role: "STREAMER",
    color: "text-purple-500",
    bio: "Streamer Oficial",
    stats: { kills: 0, deaths: 0, assists: 0 },
    roundStats: [],
  },
];

export const generateMockPlayers = (count: number): Player[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i + 1}`,
    discordName: `Usuario_${i + 1}`,
    discordId: `1234567890${i}`,
    gameNick: `ProPlayer_${i + 1}`,
    role: "PLAYER",
    stats: { kills: 0, deaths: 0, assists: 0 },
    roundStats: [],
  }));
};

export const MOCK_TOURNAMENTS: Championship[] = [
  {
    id: "1",
    name: "MIX Zula Teste - 2026",
    prize: "sem premiação",
    status: "open",
    players: generateMockPlayers(36),
    teams: [
      {
        id: "t1",
        name: "Equipe Alpha",
        players: generateMockPlayers(5),
        side: "TR",
      },
      {
        id: "t2",
        name: "Equipe Bravo",
        players: generateMockPlayers(5),
        side: "CT",
      },
      {
        id: "t3",
        name: "Equipe Charlie",
        players: generateMockPlayers(5),
        side: "TR",
      },
      {
        id: "t4",
        name: "Equipe Delta",
        players: generateMockPlayers(5),
        side: "CT",
      },
    ],
    matches: [
      {
        id: "m1",
        teamAId: "t1",
        teamBId: "t2",
        status: "preparando",
        phase: 1,
        order: 1,
        currentRound: 0,
        swappedSides: false,
      },
      {
        id: "m2",
        teamAId: "t3",
        teamBId: "t4",
        status: "desligado",
        phase: 1,
        order: 2,
        currentRound: 10,
        swappedSides: true,
        winnerId: "t3",
      },
    ],
    broadcast: {
      platform: "YOUTUBE",
      link: "https://www.youtube.com/watch?v=example",
      time: "20:00",
      streamerId: "",
    },
    settings: {
      playersPerTeam: 5,
      totalTeams: 4,
      rounds: 10,
      sideSwap: true,
      gameMode: "SABOTAGEM",
      map: "Suburbio",
    },
  },
];

export const MOCK_PLAYERS = generateMockPlayers(20);

export const MOCK_STREAMERS = INITIAL_STAFF.filter(
  (s) => s.role === "STREAMER",
);

export const MOCK_MAPS = [
  { id: "m1", name: "DOCK" },
  { id: "m2", name: "AZTEC" },
  { id: "m3", name: "MIRAGE" },
  { id: "m4", name: "DUST2" },
  { id: "m5", name: "INFERNO" },
  { id: "m6", name: "FAVELA" },
];
