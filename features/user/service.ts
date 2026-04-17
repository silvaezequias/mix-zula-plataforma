import { prisma } from "@/infra/prisma";
import validation from "@/lib/validation";
import { DB } from "@/types";
import { InternalError } from "nextfastapi/errors";

export type UpdateUserProps = {
  birthDate: string;
  playerNickname: string;
};

async function update(userId: string, data: UpdateUserProps) {
  const { birthDate, playerNickname } = await validation.user(
    { birthDate: false, playerNickname: false },
    {
      birthDate: data.birthDate,
      playerNickname: data.playerNickname,
    },
  );

  let updatedUser;

  try {
    updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isOnboarded: true,
        birthDate: birthDate,
        player: { nickname: playerNickname },
      },
    });
  } catch {
    throw new InternalError({
      message: "Houve um erro interno. Tente novamente mais tarde",
    });
  }

  return updatedUser;
}

async function findById(db: DB, userId: string) {
  return await db.user.findUnique({
    where: { id: userId },
  });
}

export const UserService = {
  update,
  findById,
};
