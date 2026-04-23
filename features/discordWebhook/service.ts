import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "nextfastapi/errors";
import { WebhookClient } from "./core";
import { GAME_MODES, tournamentStatusMap } from "@/constants/data";
import { buildWebhookPayload } from "@/lib/buildWebhookPayload";
import { Prisma, Tournament } from "@prisma/client";
import { numberOrInfinity } from "@/lib/formatter";
import { getCurrentUrl, getHost } from "@/lib/serverUtils";
import { webhookTemplates } from "./templates";
import { getTournamentOverview } from "../tournament/orchestrator/feed/GetTournamentOverview";
import { getTournamentTeams } from "../tournament/orchestrator/feed/GetTournamentTeams";
import { getTournamentParticipants } from "../tournament/orchestrator/feed/GetTournamentParticipants";

async function listTeams(tournamentId: string) {
  const webhook = webhookTemplates.list_teams;
  const tournament = await getTournamentOverview(tournamentId);
  const tournamentTeams = await getTournamentTeams(tournamentId);
  const participants = await getTournamentParticipants(tournamentId);

  if (!tournament) {
    throw new NotFoundError({
      message: "Não foi encontrado nenhum torneio com o ID inserido",
    });
  }

  if (!tournament.webhook?.listTeams) {
    throw new NotFoundError({
      message: "Não foi encontrado um URL para Webhook de listagem de times",
    });
  }

  if (!tournamentTeams.length) {
    throw new ForbiddenError({
      message: "Esse torneio ainda não possui times definidos",
    });
  }

  if (!participants) {
    throw new ForbiddenError({
      message: "Por algum motivo esse torneio não tem membro nenhum",
    });
  }

  const hook = new WebhookClient(tournament.webhook.listTeams);

  const teams = tournamentTeams.map((team) => {
    return {
      label: team.name!.toUpperCase(),
      value: team.members
        .map((member, index) => {
          const discordId = member.participant.discordId;
          const playerName = member.participant.nickname;

          return `${index + 1}. <@${discordId}> - ${playerName}`;
        })
        .join("\n"),
    };
  });

  if (!teams.length) {
    throw new BadRequestError({
      message: "Os times ainda não foram definidos.",
    });
  }

  const reservedPlayers = participants
    .filter((p) => p.status === "RESERVED")
    .map((member, index) => {
      const discordId = member.discordId;
      const playerName = member.nickname;
      return `${index + 1}. <@${discordId}> - ${playerName}`;
    });

  hook.send(
    buildWebhookPayload(
      webhook.config,
      await getListTeamsWebhookData(
        tournament,
        reservedPlayers.join("\n") || "_`Nenhum jogador na lista de reservas`_",
      ),
      teams,
    ),
  );
}

async function invite(tournamentId: string) {
  const webhook = webhookTemplates.invite;
  const tournament = await getTournamentOverview(tournamentId);

  if (!tournament) {
    throw new NotFoundError({
      message: "Não foi encontrado nenhum torneio com o ID inserido",
    });
  }

  if (!tournament.webhook?.invite) {
    throw new NotFoundError({
      message: "Não foi encontrado um URL para Webhook de convite de usuários",
    });
  }

  if (tournament.status !== "OPEN") {
    throw new BadRequestError({
      message: 'O torneio precisa estar com status de "Inscrições Abertas".',
    });
  }

  const hook = new WebhookClient(tournament.webhook.invite);

  await hook.send(
    buildWebhookPayload(webhook.config, await getInviteWebhookData(tournament)),
  );
}

export const DiscordWebhookService = {
  listTeams,
  invite,
};

export const getListTeamsWebhookData = async (
  tournament: Tournament,
  reservedPlayers: React.ReactNode,
) => {
  const dataObject = {
    "{tournament_name}": tournament.title.toUpperCase(),
    "{tournament_status}": tournamentStatusMap[tournament.status].label,
    "{tournament_url}": await getCurrentUrl(`torneios/${tournament.id}/teams`),
    "{reserve_players}": reservedPlayers as string,
  };

  return dataObject;
};

export const getInviteWebhookData = async (
  tournament: Prisma.TournamentGetPayload<{
    include: { _count: { select: { participants: true } } };
  }>,
) => {
  const { participants } = tournament._count;
  const tournamentSlots = `${participants}/${numberOrInfinity(tournament.maxRegistrations, false, true)}`;
  const tournamentUrl = await getCurrentUrl(`torneios/${tournament.id}`);

  const dataObject = {
    "{tournament_id}": tournament.id,
    "{tournament_name}": tournament.title.toUpperCase(),
    "{tournament_description}": tournament.description,
    "{tournament_prize}": tournament.prize.toUpperCase(),
    "{tournament_status}": tournamentStatusMap[tournament.status].label,
    "{tournament_slots}": tournamentSlots,
    "{tournament_game_mode}": GAME_MODES.find(
      (gm) => gm.id === tournament.gameMode,
    )!.label,
    "{tournament_url}": tournamentUrl,
    "{host_url}": await getHost(false),
  };

  return dataObject;
};
