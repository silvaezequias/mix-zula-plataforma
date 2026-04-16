import { brand } from "@/config/brand";
import { WebhookBase } from "./type";

export const InviteToTournamentTemplate: WebhookBase = {
  name: "Convite de Inscrição",
  description: "Convide jogadores para o torneio.",
  config: {
    username: "MIX ZULA - PARTICIPAR",
    content: "@everyone",
    embeds: [
      {
        description:
          "## [CLIQUE AQUI PARA SE INSCREVER]({tournament_url}/participar)\n### {tournament_name}\n{tournament_description}",
        url: "{tournament_url}/participar",
        color: 0xffb300,
        timestamp: true,
        footer: { text: brand.slogan },
        image: {
          url: "{host_url}/api/tournament/showcase/thumbnail?id={tournament_id}",
        },
        fields: [
          {
            name: "Premiação",
            value: "{tournament_prize}",
            inline: true,
          },
          {
            name: "Modo",
            value: "{tournament_game_mode}",
            inline: true,
          },
          {
            name: "Inscritos",
            value: "{tournament_slots}",
            inline: true,
          },
        ],
      },
    ],
  },
};
