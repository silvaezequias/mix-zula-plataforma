"use server";

import { getAuthOrThrow } from "@/lib/authorization/accessControl";
import { safeExecute } from "@/lib/safeExecute";
import { TournamentService } from "../tournament/service";
import { NotFoundError, UnauthorizedError } from "nextfastapi/errors";
import { STAFF_ROLES, WebhookId } from "@/constants/data";
import { DiscordWebhookService } from "./service";

export async function dispatchWebhook(
  tournamentId: string,
  webhookId: WebhookId,
) {
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
        message: "Você não tem permissão pra disparar Webhooks nesse torneio.",
      });
    }

    if (webhookId === "list_teams")
      await DiscordWebhookService.listTeams(tournamentId);
    else if (webhookId === "invite")
      await DiscordWebhookService.invite(tournamentId);
    else {
      throw new NotFoundError({
        message:
          "Nenhuma mensagem de Webhook foi encontrada para o ID inserido",
      });
    }
  });
}
