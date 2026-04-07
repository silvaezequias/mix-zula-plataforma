import {
  EndType,
  Format,
  GameMode,
  StatsType,
  TeamManagement,
  BroadcastPlatform,
} from "@prisma/client";
import { UnprocessableEntityError } from "nextfastapi/errors";

function throwError(message: string) {
  throw new UnprocessableEntityError({ message });
}

export function validateRequired(value: unknown, field: string) {
  if (value === null || value === undefined || value === "") {
    throwError(`${field} é obrigatório`);
  }
  return value;
}

export function validateString(
  value: string,
  field: string,
  min = 1,
  max = 255,
) {
  validateRequired(value, field);

  if (typeof value !== "string") {
    throwError(`${field} precisa ser um texto`);
  }

  const trimmed = value.trim();

  if (trimmed.length < min || trimmed.length > max) {
    throwError(`${field} deve ter entre ${min} e ${max} caracteres`);
  }

  return trimmed;
}

export function validateNumber(
  value: number,
  field: string,
  min?: number,
  max?: number,
) {
  validateRequired(value, field);

  if (typeof value !== "number" || isNaN(value)) {
    throwError(`${field} precisa ser um número válido`);
  }

  if (min !== undefined && value < min) {
    throwError(`${field} deve ser maior ou igual a ${min}`);
  }

  if (max !== undefined && value > max) {
    throwError(`${field} deve ser menor ou igual a ${max}`);
  }

  return value;
}

export function validateBoolean(value: boolean, field: string) {
  if (typeof value !== "boolean") {
    throwError(`${field} precisa ser verdadeiro ou falso`);
  }
  return value;
}

export function validateEnum<T>(value: T, field: string, validValues: T[]) {
  if (!validValues.includes(value)) {
    throwError(`${field} inválido`);
  }
  return value;
}

export function validateTitle(title: string) {
  return validateString(title, "Título", 3, 100);
}

export function validateDescription(description: string) {
  return validateString(description, "Descrição", 10, 1000);
}

export function validatePrize(prize: string) {
  return validateString(prize, "Premiação", 1, 200);
}

export function validateStringDate(dateString: string) {
  const date = new Date(dateString);
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  let isValid = true;
  if (isNaN(date.getTime())) isValid = false;
  if (!isoRegex.test(dateString)) isValid = false;

  if (!isValid) {
    throwError("Você precisa inserir uma data válida - (AAAA-MM-DD)");
  }
  return dateString;
}

export function validateDate(date: Date, field: string) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throwError(`${field} inválida`);
  }
  return date;
}

export function validateFutureDate(date: Date, field: string) {
  validateDate(date, field);

  if (date.getTime() < Date.now()) {
    throwError(`${field} precisa estar no futuro`);
  }

  return date;
}

export function validateTeams(totalTeams: number) {
  return validateNumber(totalTeams, "Total de times", 2, 1024);
}

export function validatePlayersPerTeam(players: number) {
  return validateNumber(players, "Jogadores por time", 0, 8);
}

export function validateMaxPlayers(max: number) {
  return validateNumber(max, "Máximo de jogadores", 0);
}

export function validateRegistrations(max: number) {
  return validateNumber(max, "Máximo de inscrições", 0);
}

export function validateFormat(format: Format) {
  return validateEnum(format, "Formato", Object.values(Format));
}

export function validateGameMode(mode: GameMode) {
  return validateEnum(mode, "Modo de jogo", Object.values(GameMode));
}

export function validateStatsType(type: StatsType) {
  return validateEnum(type, "Tipo de estatística", Object.values(StatsType));
}

export function validateTeamManagement(type: TeamManagement) {
  return validateEnum(
    type,
    "Gerenciamento de times",
    Object.values(TeamManagement),
  );
}

export function validateEndType(type: EndType) {
  return validateEnum(type, "Tipo de encerramento", Object.values(EndType));
}

export function validateBroadcastPlatform(platform?: BroadcastPlatform) {
  if (!platform) return null;
  return validateEnum(
    platform,
    "Plataforma de transmissão",
    Object.values(BroadcastPlatform),
  );
}

export function validateBroadcastUrl(url?: string) {
  if (!url) return null;

  try {
    new URL(url);
    return url;
  } catch {
    throwError("URL de transmissão inválida");
  }
}
