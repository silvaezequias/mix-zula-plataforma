import { DiscordWebhookConfig } from "@/app/torneios/[id]/(torneio)/tabs/WebhookTab/DiscordEmbedPreview";
import {
  ParticipantStatusObject,
  StaffRole,
} from "@/app/torneios/[id]/staff/StaffArea";
import { brand } from "@/config/brand";
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

export const TOKEN_REFERENCE = [
  { token: "{tournament_name}", desc: "Nome oficial da missão." },
  { token: "{tournament_prize}", desc: "Recompensa declarada." },
  { token: "{tournament_map}", desc: "Mapa da operação." },
  { token: "{player_nick}", desc: "Nick do agente (Contexto: Inscrição)." },
  { token: "{player_discord}", desc: "Menção ao Discord do agente." },
  {
    token: "{loop_teams}",
    desc: "Gera um campo automático por equipe cadastrada.",
  },
  {
    token: "{team_members}",
    desc: "Lista de membros (Use dentro do loop de equipes).",
  },
  { token: "{winner_name}", desc: "Nome da equipe vencedora." },
  { token: "{match_status}", desc: "Estado atual do confronto." },
];

export type WebhookId = "invite" | "list_teams";

export const MOCK_WEBHOOKS: {
  id: WebhookId;
  name: string;
  description: string;
  config: DiscordWebhookConfig;
}[] = [
  {
    id: "invite",
    name: "Convite de Inscrição",
    description: "Convide jogadores para o torneio.",
    config: {
      username: "MIX ZULA - PARTICIPAR",
      content: "@everyone",
      embeds: [
        {
          description:
            "# [CLIQUE PARA SE INSCREVER]({tournament_url}/participar)\n### {tournament_name}\n{tournament_description}",
          url: "{tournament_url}/participar",
          color: 0xffb300,
          timestamp: true,
          author: {
            name: `CONVITE PARA ${brand.name.toUpperCase()}`,
            url: "{tournament_url}/participar",
          },
          footer: { text: `${brand.slogan} ` },
          image: {
            url: "{tournament_url}/api/tournament/showcase/thumbnail?id={tournament_id}?format=.png",
          },
          fields: [
            {
              name: "Premiação",
              value: "{tournament_prize}",
              inline: true,
            },
            {
              name: "Modo",
              value: "{tournament_game_mode}",
              inline: true,
            },
            {
              name: "Inscritos",
              value: "{tournament_slots}",
              inline: true,
            },
          ],
        },
      ],
    },
  },
  {
    id: "list_teams",
    name: "Listagem de Equipes",
    description: "Envia a composição completa das formações dos times.",
    config: {
      username: "MIX ZULA - TIMES",
      embeds: [
        {
          title: "{tournament_name}",
          description:
            "Abaixo estão listados todos os times definidos aleatoriamente pelo sistema.",
          color: 0x4f46e5,
          timestamp: true,
          author: {
            name: "CONFERIR TORNEIO ➞ TIMES SORTEADOS 🔗",
            url: "{tournament_url}",
          },
          fields: [
            {
              name: "{loop_items}",
              value: "{item_value}",
              inline: true,
            },
            {
              name: "BANCO DE RESERVA",
              value: "{reserve_players}",
              inline: false,
            },
          ],
          footer: { text: "{tournament_status} • Última Atualização" },
        },
      ],
    },
  },
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
      "Responsável pela ordem geral, Discord e cumprimento das condutas éticas dos jogadores.",
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
  color: number;
}[] = [
  {
    id: TournamentStatus.CLOSED,
    label: "Fechado",
    color: 0x6b7280, // gray-500
  },
  {
    id: TournamentStatus.OPEN,
    label: "Inscrições Abertas",
    color: 0x22c55e, // green-500
  },
  {
    id: TournamentStatus.SETTING_TEAM,
    label: "Definindo Times",
    color: 0xeab308, // yellow-500
  },
  {
    id: TournamentStatus.READY,
    label: "Pronto para Iniciar",
    color: 0x3b82f6, // blue-500
  },
  {
    id: TournamentStatus.LIVE,
    label: "Em Andamento",
    color: 0xef4444, // red-500
  },
  {
    id: TournamentStatus.FINISHED,
    label: "Finalizado",
    color: 0x8b5cf6, // violet-500
  },
];

export const tournamentStatusMap: Record<
  TournamentStatus,
  { label: string; color: number }
> = {
  [TournamentStatus.LIVE]: {
    label: "Em Andamento",
    color: 0x4f46e5, // indigo-600
  },
  [TournamentStatus.READY]: {
    label: "Preparando para Início",
    color: 0x059669, // emerald-600
  },
  [TournamentStatus.OPEN]: {
    label: "Inscrições Abertas",
    color: 0x16a34a, // green-600
  },
  [TournamentStatus.SETTING_TEAM]: {
    label: "Definindo Times",
    color: 0xca8a04, // yellow-600
  },
  [TournamentStatus.FINISHED]: {
    label: "Finalizado",
    color: 0xdc2626, // red-600
  },
  [TournamentStatus.CLOSED]: {
    label: "Fechado",
    color: 0x991b1b, // red-800
  },
};

export const participantStatusMap: Record<
  ParticipantStatus,
  { label: string; color: string; hex: string; discordColor: number }
> = {
  [ParticipantStatus.ACTIVE]: {
    label: "Ativo",
    color: "text-green-500",
    hex: "#22c55e",
    discordColor: 0x22c55e,
  },
  [ParticipantStatus.ELIMINATED]: {
    label: "Eliminado",
    color: "text-red-500",
    hex: "#ef4444",
    discordColor: 0xef4444,
  },
  [ParticipantStatus.RESERVED]: {
    label: "Reserva",
    color: "text-yellow-500",
    hex: "#eab308",
    discordColor: 0xeab308,
  },
  [ParticipantStatus.REPLACED]: {
    label: "Substituído",
    color: "text-zinc-400",
    hex: "#a1a1aa",
    discordColor: 0xa1a1aa,
  },
  [ParticipantStatus.SPECTATOR]: {
    label: "Espectador",
    color: "text-blue-500",
    hex: "#3b82f6",
    discordColor: 0x3b82f6,
  },
};
