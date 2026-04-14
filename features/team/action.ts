"use server";

import { getAuthOrThrow } from "@/lib/authorization/accessControl";
import { safeExecute } from "@/lib/safeExecute";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "nextfastapi/errors";
import { TournamentService } from "../tournament/service";
import { STAFF_ROLES } from "@/constants/data";
import { distributePlayers } from "@/lib/teamManagement";
import { TeamService } from "./service";

export async function createRandomTeamsAction(tournamentId: string) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    const tournament = await TournamentService.findById(tournamentId);

    if (!tournament) {
      throw new NotFoundError({
        message: "Nenhum torneio encontrado com o ID inserido",
      });
    }

    const sessionMember = await TournamentService.findParticipantByUserId(
      tournamentId,
      session.user.id,
    );

    if (!sessionMember) {
      throw new UnauthorizedError({
        message: "Você nem devia estar fazendo isso",
      });
    }

    const memberRole = STAFF_ROLES.find((r) => r.id === sessionMember.role);

    if (!memberRole || memberRole?.level < 9) {
      throw new UnauthorizedError({
        message:
          "Não houve sorteio. Você não tem permissão pra gerenciar os times desse torneio.",
      });
    }

    const players = tournament.participants.filter(
      (p) => p.status === "ACTIVE",
    );

    if (players.length < 2) {
      throw new BadRequestError({
        message:
          "O torneio precisa ter pelo menos 2 jogadores para poder sortear times.",
      });
    }

    const { teams, leftovers } = distributePlayers(
      players,
      tournament.totalTeams,
      tournament.playersPerTeam,
      true,
    );

    await TeamService.deleteAllOfTournament(tournament.id);

    for (const [, player] of leftovers.entries()) {
      await TournamentService.updateParticipantStatus(player.id, "RESERVED");
    }

    for (const [index, team] of teams.entries()) {
      await TeamService.create(tournamentId, team, index + 1);
    }

    await TournamentService.update(tournamentId, { status: "READY" });
  });
}
