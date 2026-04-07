import { Role } from "@/types";
import { PayloadUser } from "@/types/next-auth";
import { Tournament } from "@prisma/client";

export const BETA_WHITELIST = [
  "367725991994458115",
  "557416664484937748",
  "299624104632254466",
  "597565657848217611",
];

export const AVAILABLE_ROLES: { label: string; value: Role; color: string }[] =
  [
    { label: "ADMINISTRADOR", value: "ADMIN", color: "text-red-500" },
    { label: "MODERADOR", value: "MODERADOR", color: "text-green-500" },
    { label: "JUIZ", value: "JUIZ", color: "text-blue-500" },
    { label: "STREAMER", value: "STREAMER", color: "text-purple-500" },
    { label: "AJUDANTE", value: "AJUDANTE", color: "text-emerald-500" },
    { label: "JOGADOR COMUM", value: "PLAYER", color: "text-zinc-400" },
  ];

// export const INITIAL_STAFF: PayloadUser[] = [
//   {
//     id: "s1",
//     gameNick: "MK Noia",
//     discordName: "MK Noia",
//     discordId: "0001",
//     role: "ADMIN",
//     color: "text-red-500",
//     stats: { kills: 0, deaths: 0, assists: 0 },
//     roundStats: [],
//   },
//   {
//     id: "s2_1",
//     gameNick: "Bingola",
//     discordName: "Bingola",
//     discordId: "0003",
//     role: "MODERADOR",
//     color: "text-green-500",
//     bio: "Especialista em Suporte",
//     stats: { kills: 0, deaths: 0, assists: 0 },
//     roundStats: [],
//   },
//   {
//     id: "s4",
//     gameNick: "Will Cabeça de pica",
//     discordName: "Will Cabeça de pica",
//     discordId: "0005",
//     role: "JUIZ",
//     color: "text-blue-500",
//     stats: { kills: 0, deaths: 0, assists: 0 },
//     roundStats: [],
//   },
//   {
//     id: "s3",
//     gameNick: "Wz careca",
//     discordName: "Wz careca",
//     discordId: "0004",
//     role: "AJUDANTE",
//     color: "text-emerald-500",
//     stats: { kills: 0, deaths: 0, assists: 0 },
//     roundStats: [],
//   },
//   {
//     id: "s2",
//     gameNick: "Lelelelex",
//     discordName: "Lelelelex",
//     discordId: "0002",
//     role: "STREAMER",
//     color: "text-purple-500",
//     bio: "Moderador de Campeonatos",
//     stats: { kills: 0, deaths: 0, assists: 0 },
//     roundStats: [],
//   },
//   {
//     id: "s5",
//     gameNick: "Alguem pra streamar",
//     discordName: "Alguem pra streamar",
//     discordId: "0006",
//     role: "STREAMER",
//     color: "text-purple-500",
//     bio: "Streamer Oficial",
//     stats: { kills: 0, deaths: 0, assists: 0 },
//     roundStats: [],
//   },
// ];

export const generateMockPlayers = (count: number): PayloadUser[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i + 1}`,
    name: `Usuario_${i + 1}`,
    discordId: `1234567890${i}`,
    birthDate: "2024-04-04",
    isOnboarded: false,
    player: { nickname: "teste" + i, clanId: null, id: null },
    email: "",
    image: "",
  }));
};

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: "1",
    title: "MIX Zula Teste - 2026",
    prize: "sem premiação",
    status: "OPEN",
    ownerId: "",
    preset: null,
    description: "",
    startDate: new Date(),
    endType: "DATE",
    endDate: null,
    format: "SINGLE_ELIMINATION",
    gameMode: "SABOTAGEM",
    statsType: "ROUND",
    teamManagement: "RANDOM",
    swapTeam: false,
    matchesPerMatch: 0,
    totalTeams: 0,
    playersPerTeam: 0,
    maxPlayers: 0,
    maxRegistrations: 0,
    confirmationSystem: false,
    confirmationTime: 0,
    hasSubstitutes: false,
    substitutesLimit: 0,
    broadcastPlatform: null,
    broadcastUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const MOCK_PLAYERS = generateMockPlayers(20);

// export const MOCK_STREAMERS = INITIAL_STAFF.filter(
//   (s) => s.role === "STREAMER",
// );

export const MOCK_MAPS = [
  { id: "m1", name: "SUBÚRBIO" },
  { id: "m2", name: "SALÃO" },
  { id: "m3", name: "ACAMPAMENTO" },
  { id: "m4", name: "CASTELO" },
  { id: "m5", name: "CHINA" },
  { id: "m6", name: "FAVELA" },
];

export const BROADCAST_PLATFORMS = [
  "YouTube",
  "Twitch",
  "Kick",
  "TikTok",
  "Outro",
];

export const GAME_MODES = [
  "Sabotagem",
  "Mata-Mata em Equipe",
  "Procurado",
  "Escolta",
  "Eliminação",
];
