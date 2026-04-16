import { InviteToTournamentTemplate } from "./InviteToTournament";
import { ListTournamentTeamsTemplate } from "./ListTournamentTeams";

export const webhookTemplates = {
  invite: InviteToTournamentTemplate,
  list_teams: ListTournamentTeamsTemplate,
};

export type WebhookId = keyof typeof webhookTemplates;
