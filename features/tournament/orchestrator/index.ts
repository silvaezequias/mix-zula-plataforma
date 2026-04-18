import { createOrUpdateRoleRequest } from "./CreateOrUpdateRoleRequest";
import { createParticipant } from "../../participant/orchestrator/CreateParticipant";
import { createRandomTeams } from "./CreateRandomTeams";
import { createTournament } from "./CreateTournament";
import { getTournamentMember } from "./feed/GetTournamentMember";
import { getTournamentOverview } from "./feed/GetTournamentOverview";
import { generateBracket } from "./GenerateBracket";
import { handleRoleRequest } from "./HandleRoleRequest";
import { updateTournament } from "./UpdateTournament";
import { getTournamentParticipants } from "./feed/GetTournamentParticipants";
import { getTournamentTeams } from "./feed/GetTournamentTeams";
import { getTournamentMatches } from "./feed/GetTournamentMatches";

export const TournamentOrchestrator = {
  handleRoleRequest,
  createOrUpdateRoleRequest,
  createParticipant,
  createRandomTeams,
  createTournament,
  updateTournament,
  generateBracket,

  feed: {
    getTournamentOverview,
    getTournamentMember,
    getTournamentParticipants,
    getTournamentTeams,
    getTournamentMatches,
  },
};
