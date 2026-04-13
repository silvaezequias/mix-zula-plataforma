import { MatchStatus, Prisma, Tournament } from "@prisma/client";
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

type IncludedTeam = {
  select: {
    id: true;
    name: true;
    members: {
      include: {
        participant: {
          select: {
            user: true;
          };
        };
      };
    };
  };
};

export type FullTournamentRoleRequest = Prisma.TournamentRoleRequestGetPayload<{
  include: {
    owner: true;
  };
}>;

export type TournamentAtList = Prisma.TournamentGetPayload<{
  include: {
    _count: { select: { participants: true } };
  };
}> &
  Tournament;

export type FullTournament = Prisma.TournamentGetPayload<{
  include: {
    teams: {
      include: {
        members: {
          include: {
            participant: {
              status: true;
              role: true;
              select: {
                user: {
                  select: {
                    accounts: {
                      select: {
                        providerAccountId: true;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
    matches: {
      include: {
        team1: IncludedTeam;
        team2: IncludedTeam;
        winnerTeam: IncludedTeam;
      };
    };
    participants: {
      select: {
        user: true;
        role: true;
        id: true;
        status: true;
      };
    };
  };
}>;

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
