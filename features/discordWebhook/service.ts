import { TournamentService } from "../tournament/service";
import { BadRequestError, NotFoundError } from "nextfastapi/errors";
import { WebhookClient } from "./core";
import { GAME_MODES, tournamentStatusMap } from "@/constants/data";
import { buildWebhookPayload } from "@/lib/buildWebhookPayload";
import { ParticipantStatus } from "@prisma/client";
import { numberOrInfinity } from "@/lib/formatter";
import { getCurrentUrl, getHost } from "@/lib/serverUtils";
import { webhookTemplates } from "./templates";
import { prisma } from "@/infra/prisma";

async function listTeams(tournamentId: string) {
  const webhook = webhookTemplates.list_teams;
  const tournament = await TournamentService.findById(prisma, tournamentId);

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

  const hook = new WebhookClient(tournament.webhook.listTeams);

  const teams = tournament.teams.map((team) => {
    return {
      label: team.name!.toUpperCase(),
      value: team.members
        .map((member, index) => {
          const discordId = member.participant.user.discordId;
          const playerName = member.participant.user.player?.nickname;

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

  const reservePlayers = tournament.participants
    .filter((p) => p.status === "RESERVED")
    .map((member, index) => {
      const discordId = member.user.discordId;
      const playerName = member.user.player?.nickname;
      return `${index + 1}. <@${discordId}> - ${playerName}`;
    });

  const dataObject = {
    "{tournament_name}": tournament.title,
    "{tournament_status}": tournamentStatusMap[tournament.status].label,
    "{tournament_url}": await getCurrentUrl(
      `torneios/${tournament.id}?tab=teams`,
    ),
    "{reserve_players}":
      reservePlayers.join("\n") || "_`Sem jogadores reserva`_",
  };

  hook.send(buildWebhookPayload(webhook.config, dataObject, teams));
}

async function invite(tournamentId: string) {
  const webhook = webhookTemplates.invite;
  const tournament = await TournamentService.findById(prisma, tournamentId);

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

  const parcitipants = tournament.participants.filter((p) =>
    (["ACTIVE", "RESERVED"] as ParticipantStatus[]).includes(p.status),
  );
  const tournamentSlots = `${parcitipants.length}/${numberOrInfinity(tournament.maxRegistrations, false, true)}`;
  const tournamentUrl = await getCurrentUrl(`torneios/${tournament.id}`);
  const hostUrl = await getHost(false);

  const dataObject = {
    "{tournament_id}": tournament.id,
    "{tournament_name}": tournament.title.toUpperCase(),
    "{tournament_description}": tournament.description,
    "{tournament_prize}": tournament.prize,
    "{tournament_status}": tournamentStatusMap[tournament.status].label,
    "{tournament_slots}": tournamentSlots,
    "{tournament_game_mode}": GAME_MODES.find(
      (gm) => gm.id === tournament.gameMode,
    )!.label,
    "{tournament_url}": tournamentUrl,
    "{host_url}": hostUrl,
  };

  await hook.send(buildWebhookPayload(webhook.config, dataObject));
}

export const DiscordWebhookService = {
  listTeams,
  invite,
};
