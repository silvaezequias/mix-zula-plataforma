import { Role } from "@/types";

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
