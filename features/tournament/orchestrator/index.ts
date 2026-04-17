import { createOrUpdateRoleRequest } from "./CreateOrUpdateRoleRequest";
import { createParticipant } from "./CreateParticipant";
import { createRandomTeams } from "./CreateRandomTeams";
import { createTournament } from "./CreateTournament";
import { handleRoleRequest } from "./HandleRoleRequest";
import { updateTournament } from "./UpdateTournament";

export const TournamentOrchestrator = {
  handleRoleRequest,
  createOrUpdateRoleRequest,
  createParticipant,
  createRandomTeams,
  createTournament,
  updateTournament,
};
