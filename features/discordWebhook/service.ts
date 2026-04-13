import { TournamentService } from "../tournament/service";
import { NotFoundError } from "nextfastapi/errors";
import { groupInPairs } from "@/lib/utils";
import { EmbedBuilder, WebhookClient } from "./core";
import { tournamentStatusMap } from "@/constants/data";

async function listTeams(tournamentId: string, redirectUrl?: string) {
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

  const status = tournamentStatusMap[tournament.status];

  const hook = new WebhookClient(tournament.webhook.listTeams);
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `Ver Torneio 🔗 | ${status?.label.toUpperCase()}`,
      url: redirectUrl,
    })
    .setDescription(
      `### ${tournament.title}\n> ${tournament.description}\n### PREMIAÇÃO\n> ${tournament.prize}\n`,
    )
    .setTimestamp()
    .setFooter({
      text: "Última atualização",
    })
    .setColor(status!.color!);

  groupInPairs(tournament.teams).forEach(([team1, team2]) => {
    embed.addField(
      team1.name!,
      team1.members.map((m) => `<@${m.participant.user.discordId}>`).join("\n"),
      true,
    );

    embed.addField("Vs", "", true);

    embed.addField(
      team2.name!,
      team2.members.map((m) => `<@${m.participant.user.discordId}>`).join("\n"),
      true,
    );
  });

  return await hook.send({ embeds: [embed], content: embed.embed.text });
}

export const DiscordWebhookService = {
  listTeams,
};
