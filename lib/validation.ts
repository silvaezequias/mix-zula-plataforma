import { User } from "@prisma/client";
import { BadRequestError, UnprocessableEntityError } from "nextfastapi/errors";

type Bool<Schema> = Partial<Record<keyof Schema, boolean>>;

const validation = {
  user: validateUser,
};

export type UserValidationProps = Omit<User, "player"> & {
  playerId: string;
  playerNickname: string;
  playerClanId: string;
};

async function validateUser(
  requiredKeys: Bool<UserValidationProps>,
  data: Partial<UserValidationProps>,
) {
  Object.entries(requiredKeys).forEach(([key, value]) => {
    if (value) {
      if (
        !(key in data) ||
        !data[key as unknown as keyof UserValidationProps]
      ) {
        throw new BadRequestError({
          message: "Insira todos os dados necessários.",
          action: key,
        });
      }
    }
  });

  const userObject: Partial<UserValidationProps> = {};

  const { ...leftData } = data;

  Object.entries(leftData).forEach(([key, value]) => {
    if (key in requiredKeys) {
      userObject[key as keyof UserValidationProps] = value as typeof value &
        undefined;
    }
  });

  if ("playerNickname" in requiredKeys) {
    userObject.playerNickname = validateNickname(data.playerNickname!);
  }

  if ("birthDate" in requiredKeys) {
    userObject.birthDate = validateDate(data.birthDate as unknown as string);
  }

  return userObject;
}

function validateNickname(nickname: string) {
  nickname = nickname.replace(/ /g, "");

  if (nickname.length < 3 || nickname.length > 30) {
    throw new UnprocessableEntityError({
      message:
        "Você precisa colocar um nickname válido, o mesmo que você usa no jogo",
    });
  }

  return nickname;
}

function validateDate(dateString: string) {
  const date = new Date(dateString);
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  let isValid = true;

  if (isNaN(date.getTime())) isValid = false;
  if (!isoRegex.test(dateString)) isValid = false;

  if (!isValid) {
    throw new UnprocessableEntityError({
      message: "Você precisa inserir uma data válida - (AAAA-MM-DD)",
    });
  }

  return date;
}

export default validation;
