import {
  ParticipantStatusObject,
  StaffRole,
} from "@/app/torneios/[id]/staff/StaffArea";
import { Role } from "@/types";
import {
  GameMode,
  ParticipantRole,
  ParticipantStatus,
  TournamentStatus,
} from "@prisma/client";
import { Radio, Shield, ShieldUser, Target, User, Users } from "lucide-react";

export const BETA_WHITELIST = [
  "367725991994458115",
  "557416664484937748",
  "299624104632254466",
  "597565657848217611",
];

export const STAFF_ROLES: StaffRole[] = [
  {
    id: "ADMIN",
    title: "Administrador",
    description: "Responsável geral pelo torneio e gestão.",
    icon: <ShieldUser size={24} />,
    color: "text-red-500",
    bg: "bg-red-500/10",
    level: 10,
  },
  {
    id: "MODERADOR",
    title: "Moderador",
    description:
      "Responsável pela ordem geral, Discord e cumprimento das condutas éticas dos agentes.",
    icon: <Shield size={24} />,
    color: "text-green-500",
    bg: "bg-green-500/10",
    level: 9,
  },
  {
    id: "JUIZ",
    title: "Juiz",
    description:
      "Monitoria direta das partidas, validação de KDA e resolução de conflitos técnicos in-game.",
    icon: <Target size={24} />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    level: 8,
  },
  {
    id: "STREAMER",
    title: "Streamer",
    description:
      "Voz oficial do Torneio. Narrador de comabtes e responsável pela transmissão ao vivo dos jogos.",
    icon: <Radio size={24} />,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    level: 3,
  },
  {
    id: "AJUDANTE",
    title: "Ajudante",
    description:
      "Suporte na organização, inscrições e auxílio geral aos jogadores.",
    icon: <Users size={24} />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    level: 5,
  },
  {
    id: "PLAYER",
    title: "Jogador",
    description:
      "Esse cargo não possui permissões especiais, é apenas uma identificação dos jogadores.",
    icon: <User size={24} />,
    color: "text-white-500",
    bg: "bg-white-500/10",
    level: 0,
  },
];

export const PARTICIPANT_STATUS: ParticipantStatusObject[] = [
  {
    id: "ACTIVE",
    title: "Ativo",
    description: "Jogador disponível para jogar",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    id: "ELIMINATED",
    title: "Eliminado",
    description: "Jogador eliminado e não pode jogar",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: "REPLACED",
    title: "Substituído",
    description: "Jogador foi substituído e não pode jogar",
    color: "text-zinc-400",
    bg: "bg-zinc-400/10",
  },
  {
    id: "RESERVED",
    title: "Reserva",
    description: "Jogador está na reserva e ainda não pode jogar",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    id: "SPECTATOR",
    title: "Espectador",
    description: "Jogador não pode jogar pois está apenas como espectador",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
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
  "YOUTUBE",
  "TWITCH",
  "KICK",
  "TIKTOK",
  "OUTRO",
];

export const GAME_MODES: { id: GameMode; label: string }[] = [
  {
    id: "SABOTAGEM",
    label: "Sabotagem",
  },
  {
    id: "MATA_MATA",
    label: "Mata-Mata em Equipe",
  },
  {
    id: "ELIMINAÇÃO",
    label: "Eliminação",
  },
  {
    id: "ESCOLTA",
    label: "Escolta",
  },
  {
    id: "PROCURADO",
    label: "Procurado",
  },
];

export const roleColors: Record<ParticipantRole, string> = {
  ADMIN: "text-red-500",
  MODERADOR: "text-green-500",
  PLAYER: "text-zinc-300",
  AJUDANTE: "text-emerald-500",
  JUIZ: "text-blue-500",
  STREAMER: "text-purple-500",
};

export const tournamentStatus: {
  id: TournamentStatus;
  label: string;
}[] = [
  { id: TournamentStatus.CLOSED, label: "Fechado" },
  { id: TournamentStatus.OPEN, label: "Inscrições Abertas" },
  { id: TournamentStatus.SETTING_TEAM, label: "Definindo Times" },
  { id: TournamentStatus.READY, label: "Pronto para Iniciar" },
  { id: TournamentStatus.LIVE, label: "Em Andamento" },
  { id: TournamentStatus.FINISHED, label: "Finalizado" },
];

export const participantStatusMap: Record<
  ParticipantStatus,
  { label: string; color: string }
> = {
  [ParticipantStatus.ACTIVE]: {
    label: "Ativo",
    color: "text-green-500",
  },
  [ParticipantStatus.ELIMINATED]: {
    label: "Eliminado",
    color: "text-red-500",
  },
  [ParticipantStatus.RESERVED]: {
    label: "Reserva",
    color: "text-yellow-500",
  },
  [ParticipantStatus.REPLACED]: {
    label: "Substituído",
    color: "text-zinc-400",
  },
  [ParticipantStatus.SPECTATOR]: {
    label: "Espectador",
    color: "text-blue-500",
  },
};
