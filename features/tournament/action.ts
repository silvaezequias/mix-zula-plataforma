"use server";

import { getAuthOrThrow } from "@/lib/authorization/accessControl";
import { TournamentProps } from "./service";
import { safeExecute } from "@/lib/safeExecute";
import { ParticipantRole, ParticipantStatus } from "@prisma/client";
import { TournamentOrchestrator } from "./orchestrator";
import { ParticipantOrchestrator } from "../participant/orchestrator";

export async function createTournamentAction(formData: TournamentProps) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    return TournamentOrchestrator.createTournament(formData, session.user.id);
  });
}

export async function updateTournament(
  tournamentId: string,
  data: TournamentProps,
) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    return await TournamentOrchestrator.updateTournament(data, {
      tournamentId,
      userId: session.user.id,
    });
  });
}

export async function createTournamentParticipantAction(tournamentId: string) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    return await TournamentOrchestrator.createParticipant(
      tournamentId,
      session.user.id,
    );
  });
}

export async function createTournamentRoleRequestAction(
  tournamentId: string,
  role: ParticipantRole,
) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    return TournamentOrchestrator.createOrUpdateRoleRequest(
      tournamentId,
      session.user.id,
      role,
    );
  });
}

export async function handleTournamentRoleRequestAction(
  requestId: string,
  accept: boolean,
) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    return await TournamentOrchestrator.handleRoleRequest(
      requestId,
      accept,
      session.user.id,
    );
  });
}

export async function changeParticipantRoleAction(
  participantId: string,
  role: ParticipantRole,
) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    return ParticipantOrchestrator.updateRole(
      participantId,
      role,
      session.user.id,
    );
  });
}

export async function changeParticipantStatusAction(
  participantId: string,
  status: ParticipantStatus,
) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    return await ParticipantOrchestrator.updateStatus(
      participantId,
      status,
      session.user.id,
    );
  });
}

export async function removeParticipantAction(participantId: string) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    return await ParticipantOrchestrator.removeParticipant(
      participantId,
      session.user.id,
    );
  });
}

export async function createRandomTeamsAction(
  tournamentId: string,
  reshuffle = false,
) {
  return await safeExecute(async () => {
    const session = await getAuthOrThrow();

    return await TournamentOrchestrator.createRandomTeams(
      tournamentId,
      session.user.id,
      reshuffle,
    );
  });
}
