import { User } from "@prisma/client";
import { TournamentProps } from "@/features/tournament/service";
import { BadRequestError } from "nextfastapi/errors";
import * as validate from "./fields";

type Bool<T> = Partial<Record<keyof T, boolean>>;
type FieldValidators<T> = Partial<{
  [K in keyof T]: (value: T[K]) => T[K];
}>;

function validateRequiredFields<T>(required: Bool<T>, data: Partial<T>) {
  for (const key in required) {
    if (!required[key]) continue;

    const value = data[key];

    if (value === undefined || value === null) {
      throw new BadRequestError({
        message: "Insira todos os dados necessários.",
        action: key,
      });
    }
  }
}

function createValidator<T>(validators?: FieldValidators<T>) {
  return function validate(required: Bool<T>, data: Partial<T>): Partial<T> {
    validateRequiredFields(required, data);

    const result: Partial<T> = {};

    for (const key in data) {
      const value = data[key];

      if (value === undefined) continue;

      const validator = validators?.[key];

      result[key] = validator
        ? validator(value as T[Extract<keyof T, string>])
        : value;
    }

    return result;
  };
}
const validateTournament = createValidator<TournamentProps>({
  title: (value) => validate.validateTitle(value!),
  description: (value) => validate.validateDescription(value!),
  prize: (value) => validate.validatePrize(value!),
  preset: (value) => validate.validateString(value!, "Preset", 1, 50),
  startDate: (value) => validate.validateDate(value!, "Data de Início"),
  endDate: (value) => validate.validateDate(value!, "Data de Término"),
  endType: (value) => validate.validateEndType(value!),
  format: (value) => validate.validateFormat(value!),
  gameMode: (value) => validate.validateGameMode(value!),
  statsType: (value) => validate.validateStatsType(value!),
  teamManagement: (value) => validate.validateTeamManagement(value!),
  swapTeam: (value) => validate.validateBoolean(value!, "Troca de Lados"),
  matchesPerMatch: (value) =>
    validate.validateNumber(value!, "Rodadas por Match", 1),
  totalTeams: (value) => validate.validateNumber(value!, "Máximo de Times", 0),
  playersPerTeam: (value) => validate.validatePlayersPerTeam(value!),
  maxPlayers: (value) => validate.validateMaxPlayers(value!),
  maxRegistrations: (value) => validate.validateRegistrations(value!),
  confirmationSystem: (value) =>
    validate.validateBoolean(value!, "Sistema de Confirmação"),
  confirmationTime: (value) =>
    validate.validateNumber(value!, "Tempo de Confirmação", 0),
  hasSubstitutes: (value) =>
    validate.validateBoolean(value!, "Permitir subistituição"),
  substitutesLimit: (value) =>
    validate.validateNumber(value!, "Limite de Substitutos", 0),
  broadcastPlatform: (value) => validate.validateBroadcastPlatform(value!),
  broadcastUrl: (value) => validate.validateBroadcastUrl(value!),
});

export type UserValidationProps = Omit<User, "player"> & {
  playerId: string;
  playerNickname: string;
  playerClanId: string;
};

const validateUser = createValidator<UserValidationProps>({
  playerNickname: (value) => validate.validateString(value, "Nickname", 3, 20),
  playerClanId: (value) => validate.validateString(value, "Clan ID", 1, 50),
  playerId: (value) => validate.validateString(value, "Player ID", 1, 50),
  name: (value) => validate.validateString(value!, "Nome", 2, 100),
  email: (value) => {
    const email = validate.validateString(value!, "Email", 5, 100);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new BadRequestError({
        message: "Email inválido",
        action: "email",
      });
    }

    return email.toLowerCase();
  },

  birthDate: (value) => validate.validateStringDate(value as unknown as string),
});

const validation = {
  user: validateUser,
  tournament: validateTournament,
};

export default validation;
