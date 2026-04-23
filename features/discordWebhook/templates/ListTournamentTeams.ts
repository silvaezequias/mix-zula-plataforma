import { WebhookBase } from "./type";

export const ListTournamentTeamsTemplate: WebhookBase = {
  name: "Listagem de Equipes",
  description: "Envia a composição completa das formações dos times.",
  config: {
    username: "MIX ZULA - TIMES",
    embeds: [
      {
        title: "{tournament_name}",
        description:
          "Abaixo estão listados todos os times definidos aleatoriamente pelo sistema.",
        color: 0x4f46e5,
        timestamp: true,
        author: {
          name: "CONFERIR TORNEIO ➞ TIMES SORTEADOS 🔗",
          url: "{tournament_url}",
        },
        fields: [
          {
            name: "{loop_items}",
            value: "{item_value}",
            inline: false,
          },
          {
            name: "BANCO DE RESERVA",
            value: "{reserve_players}",
            inline: false,
          },
        ],
        footer: { text: "{tournament_status} • Última Atualização" },
      },
    ],
  },
};
