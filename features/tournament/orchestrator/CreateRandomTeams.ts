import { prisma } from "@/infra/prisma";
import { DB } from "@/types";
import { ParticipantService } from "../../participant/service";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "nextfastapi/errors";
import { distributePlayers, shuffle } from "@/lib/teamManagement";
import { TournamentService } from "../service";
import { TeamService } from "../../team/service";
import { Participant, Tournament } from "@prisma/client";
import { TournamentCache } from "../cache";
import { staffRolesMap } from "@/constants/data";
import { TeamsCache } from "@/features/team/cache";
import { ParticipantCache } from "@/features/participant/cache";

async function createTeams(
  tx: DB,
  tournamentId: string,
  teams: Participant[][],
) {
  const createdTeams = await Promise.all(
    teams.map(async (teamPlayers, index) => {
      const team = await TeamService.create(tx, {
        tournamentId,
        teamIndex: index + 1,
      });

      await TeamService.addMembers(
        tx,
        team.id,
        teamPlayers.map((p) => p.id),
      );

      return team;
    }),
  );

  return createdTeams;
}

export async function createRandomTeams(
  tournamentId: string,
  userId: string,
  reshuffle = false,
) {
  const result = await prisma.$transaction(async (tx: DB) => {
    const tournament = (await TournamentService.findById(tx, tournamentId))!;
    validateTournament(tournament);

    const member = await ParticipantService.findByUserId(
      tx,
      tournamentId,
      userId,
    );
    validatePermissions(member);

    const existingTeams = await TeamService.findManyByTournamentId(
      tx,
      tournamentId,
    );

    if (existingTeams.length > 0 && !reshuffle) {
      throw new BadRequestError({
        message: "Os times já foram gerados. Use re-sorteio.",
      });
    }

    if (reshuffle) {
      await handleReshuffle(tx, tournamentId);
    }

    const participants = await ParticipantService.getActive(tx, tournamentId);

    const maxTeams =
      tournament.totalTeams === 0 ? Infinity : tournament.totalTeams;

    const maxPlayersPerTeam = tournament.playersPerTeam || 8;

    if (participants.length < 2) {
      throw new BadRequestError({
        message: "Não tem participantes suficientes para criar times",
      });
    }

    const shuffled = shuffle(participants);

    const { teams, leftovers } = distributePlayers(
      shuffled,
      maxTeams,
      maxPlayersPerTeam,
      true,
    );

    const createdTeams = await createTeams(tx, tournamentId, teams);

    await tx.participant.updateMany({
      where: { id: { in: leftovers.map((p) => p.id) } },
      data: { status: "RESERVED" },
    });

    return {
      teamsCreated: createdTeams.length,
    };
  });

  if (result.teamsCreated) {
    await TournamentCache.revalidate(tournamentId);
    await TeamsCache.revalidate(tournamentId);
    await ParticipantCache.revalidate(undefined, tournamentId);
  }

  return result;
}

function validateTournament(tournament: Tournament | null) {
  if (!tournament) {
    throw new NotFoundError({
      message: "Torneio não foi encontrado com o ID inserido",
    });
  }

  if (tournament.status !== "SETTING_TEAM") {
    throw new ForbiddenError({
      message: "O torneio não está no estágio de definição de times",
    });
  }
}

function validatePermissions(member: Participant | null) {
  if (!member) {
    throw new ForbiddenError({
      message: "Você não é membro deste torneio",
    });
  }

  const role = staffRolesMap[member.role];

  if (!role || role.level < 9) {
    throw new ForbiddenError({
      message: "Você não tem permissão para gerenciar os times",
    });
  }
}

async function handleReshuffle(tx: DB, tournamentId: string) {
  await tx.participant.updateMany({
    where: { tournamentId, status: { in: ["ACTIVE", "RESERVED"] } },
    data: { status: "ACTIVE" },
  });

  await tx.teamMember.deleteMany({
    where: { team: { tournamentId } },
  });

  await tx.team.deleteMany({
    where: { tournamentId },
  });
}
