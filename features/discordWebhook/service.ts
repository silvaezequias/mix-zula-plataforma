import { TournamentService } from "../tournament/service";
import { BadRequestError, NotFoundError } from "nextfastapi/errors";
import { MessageComponent, WebhookClient } from "./core";
import {
  GAME_MODES,
  MOCK_WEBHOOKS,
  tournamentStatusMap,
} from "@/constants/data";
import { buildWebhookPayload } from "@/lib/buildWebhookPayload";
import { getCurrentUrl } from "@/app/torneios/[id]/(torneio)/page";
import { ParticipantStatus } from "@prisma/client";
import { numberOrInfinity } from "@/lib/formatter";

async function listTeams(tournamentId: string) {
  const webhook = MOCK_WEBHOOKS.find((w) => w.id === "list_teams")!;
  const tournament = await TournamentService.findById(tournamentId);

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
  const webhook = MOCK_WEBHOOKS.find((w) => w.id === "invite")!;
  const tournament = await TournamentService.findById(tournamentId);

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

  const dataObject = {
    "{tournament_id}": tournament.id,
    "{tournament_name}": tournament.title,
    "{tournament_description}": tournament.description,
    "{tournament_prize}": tournament.prize,
    "{tournament_status}": tournamentStatusMap[tournament.status].label,
    "{tournament_slots}": tournamentSlots,
    "{tournament_game_mode}": GAME_MODES.find(
      (gm) => gm.id === tournament.gameMode,
    )!.label,
    "{tournament_url}": tournamentUrl,
  };

  const redirectButton: MessageComponent = {
    type: 1,
    components: [
      {
        type: 2,
        style: 5,
        label: "teste",
        url: tournamentUrl,
      },
    ],
  };

  await hook.send({
    ...buildWebhookPayload(webhook.config, dataObject),
    components: [redirectButton],
  });
}

export const DiscordWebhookService = {
  listTeams,
  invite,
};
