import { ParticipantService } from "@/features/participant/service";
import { prisma } from "@/infra/prisma";
import { Tournament } from "@prisma/client";
import { ForbiddenError, NotFoundError } from "nextfastapi/errors";
import { TournamentCache } from "../cache";
import { staffRolesMap } from "@/constants/data";
import validation from "@/lib/validation";
import { TournamentService } from "../service";

export type UpdateTournamentProps = Partial<Tournament>;

export async function updateTournament(
  data: UpdateTournamentProps,
  props: {
    tournamentId: string;
    userId: string;
  },
) {
  const result = await prisma.$transaction(async (tx) => {
    const existingTournament = await TournamentService.findById(
      tx,
      props.tournamentId,
    );

    if (!existingTournament) {
      throw new NotFoundError({
        message: "Não foi encontrado um torneio com o ID inserido",
      });
    }

    const participant = await ParticipantService.findByUserId(
      tx,
      props.tournamentId,
      props.userId,
    );

    if (!participant) {
      throw new ForbiddenError({
        message: "Você não pode fazer isso. Você nem é membro desse torneio",
      });
    }

    const participantRole = staffRolesMap[participant.role];

    if (!participantRole || participantRole?.level < 9) {
      throw new ForbiddenError({
        message:
          "Infelizmente você não tem permissão pra atualizar informações do torneio",
      });
    }

    const validData = validation.tournament(
      {
        title: false,
        description: false,
        prize: false,

        status: false, // TODO: Controlar STATUS internamente e remover possibilidade de alteração

        startDate: false,
        endType: false,
        endDate: false,

        format: false,
        gameMode: false,
        statsType: false,
        teamManagement: false,

        swapTeam: false,
        matchesPerMatch: false,

        totalTeams: false,
        playersPerTeam: false,
        maxPlayers: false,
        maxRegistrations: false,

        confirmationSystem: false,
        confirmationTime: false,

        hasSubstitutes: false,
        substitutesLimit: false,

        broadcastPlatform: false,
        broadcastUrl: false,
      },
      data,
    );

    return await TournamentService.update(tx, props.tournamentId, validData);
  });

  if (result) await TournamentCache.revalidate(props.tournamentId);

  return result;
}
