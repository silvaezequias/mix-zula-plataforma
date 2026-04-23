import { ParticipantService } from "../features/participant/service";
import { TournamentService } from "../features/tournament/service";
import { UserService } from "../features/user/service";
import { prisma } from "../infra/prisma";
import { faker } from "@faker-js/faker";
import {
  BroadcastPlatform,
  EndType,
  Format,
  GameMode,
  ParticipantRole,
  StatsType,
  TeamManagement,
  TournamentStatus,
  User,
} from "@prisma/client";

export async function seed() {
  const users = await createUsers();

  const tournament1 = await createTournament(
    users[0].id,
    TournamentStatus.OPEN,
  );

  const ownerParticipant = await createParticipant(
    users[0],
    tournament1.id,
    ParticipantRole.ADMIN,
  );

  const randomUsers = faker.helpers.arrayElements(users, 10);

  for (const user of randomUsers) {
    await createParticipant(user, tournament1.id, ParticipantRole.PLAYER);
  }
}

async function createUsers() {
  const stringDate = faker.date
    .birthdate({ min: 18, max: 60, mode: "age" })
    .toLocaleDateString("pt-BR");

  const usersData = Array.from({ length: 30 }).map(() => {
    return {
      name: `${faker.person.firstName()}_${faker.person.lastName()}`,
      email: faker.internet.email(),
      birthDate: stringDate,
      isOnboarded: true,
      discordId: faker.string.numeric(18),
      player: {
        nickname: faker.internet.username(),
        id: null,
        clanId: null,
      },
    };
  });

  const userList = await UserService.createMany(prisma, usersData);

  console.log("Usuários criados:", userList.length);

  return userList;
}

async function createTournament(ownerId: string, status: TournamentStatus) {
  const tournamentData = {
    title: "Torneio: " + faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    createdAt: new Date(),
    broadcastPlatform: BroadcastPlatform.YOUTUBE,
    broadcastUrl: "https://www.youtube.com/channel/CHANNEL_ID",

    confirmationSystem: false,
    confirmationTime: 0,
    endDate: faker.date.soon({ days: 30 }),
    endType: EndType.MANUAL,
    format: Format.SINGLE_ELIMINATION,
    gameMode: GameMode.SABOTAGEM,
    hasSubstitutes: false,
    matchesPerMatch: 1,
    maxPlayers: 16,
    maxRegistrations: 20,
    playersPerTeam: 5,
    preset: "none",
    prize: faker.lorem.sentence(),
    startDate: faker.date.soon({ days: 1 }),
    statsType: StatsType.MATCH,
    status: status,
    substitutesLimit: 0,
    teamManagement: TeamManagement.RANDOM,
    swapTeam: false,
    totalTeams: 0,
  };

  const tournament = await TournamentService.create(
    prisma,
    ownerId,
    tournamentData,
  );

  console.log("Torneio criado:", tournament.title);

  return tournament;
}

async function createParticipant(
  user: User,
  tournamentId: string,
  role: ParticipantRole,
) {
  const participant = await ParticipantService.create(prisma, {
    discordId: user.discordId!,
    name: user.name!,
    nickname: user.player!.nickname,
    tournamentId,
    role,
    status: "ACTIVE",
    userId: user.id,
  });

  console.log(
    `Participante criado: ${participant.nickname} (${participant.id}) para o torneio ${tournamentId} com o papel de ${role}`,
  );

  return participant;
}
