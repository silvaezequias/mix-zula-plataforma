import { PayloadUser } from "./next-auth";

export type Role =
  | "ADMIN"
  | "MODERADOR"
  | "JUIZ"
  | "AJUDANTE"
  | "PLAYER"
  | "STREAMER";

export interface RoundStat {
  round: number;
  kills: number;
  deaths: number;
  assists: number;
}

export interface BroadcastSettings {
  platform: string;
  link: string;
  time: string;
  streamerId: string;
}

export interface ChampSettings {
  playersPerTeam: number;
  totalTeams: number;
  rounds: number;
  sideSwap: boolean;
  gameMode: string;
  map: string;
}

export interface Team {
  id: string;
  name: string;
  players: PayloadUser[];
  side: "TR" | "CT";
}

export type ChampStatus =
  | "open"
  | "setting_teams"
  | "randomizing"
  | "ready"
  | "live"
  | "finished";

export enum GameMode {
  Deathmatch = "MATA-MATA",
  Defuse = "SABOTAGEM",
}
export type MatchStatus =
  | "desligado"
  | "preparando"
  | "iniciado"
  | "finalizado";

export interface Match {
  id: string;
  teamAId: string;
  teamBId: string;
  status: MatchStatus;
  winnerId?: string;
  order: number;
  phase: number; // 1: Quartas, 2: Semi, 3: Final
  currentRound: number; // Rodada atual controlada pela staff
  swappedSides: boolean; // Estado para controle de inversão de lado
}

export interface Championship {
  id: string;
  name: string;
  prize: string;
  status: ChampStatus;
  players: PayloadUser[];
  teams: Team[];
  matches: Match[];
  broadcast: {
    platform: string;
    link: string;
    time: string;
    streamerId: string;
  };
  settings: {
    playersPerTeam: number;
    totalTeams: number;
    rounds: number;
    sideSwap: boolean;
    gameMode: string;
    map: string;
  };
}
