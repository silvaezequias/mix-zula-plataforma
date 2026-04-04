import controller from "@/middleware";
import { Middleware } from "nextfastapi/types";
import { AuthenticatedSession, FlowContext } from "@/middleware/flow";
import {
  BadRequestError,
  InternalError,
  UnauthorizedError,
} from "nextfastapi/errors";
import validation, { UserValidationProps } from "@/lib/validation";
import { prisma } from "@/infra/prisma";

type InputBody = Pick<UserValidationProps, "birthDate" | "playerNickname">;
type Context = { inputBody: Partial<InputBody> } & FlowContext;
type AuthenticatedContext = Context & AuthenticatedSession;
type Params = { id: string };

const handlePatchValidation: Middleware<Context> = async (req, _, next) => {
  let inputProps = {} as InputBody;

  try {
    inputProps = await req.json();
  } catch {
    throw new BadRequestError({
      message: "Você precisa preencher os campos obrigatórios",
    });
  }

  const validInput = await validation.user(
    { birthDate: true, playerNickname: true },
    inputProps,
  );

  req.context.inputBody = validInput;
  return next();
};

const handlePatchAuthorization: Middleware<Context, Params> = async (
  req,
  params,
  next,
) => {
  const { inputBody } = req.context;
  const { id: targetUserId } = await params;

  const requesterId =
    "id" in req.context.session?.user ? req.context.session?.user.id : null;
  const isSameUser = targetUserId === requesterId;

  if (!req.context.session.isAuthenticated || !isSameUser)
    throw new UnauthorizedError({
      message: "Você não tem permissão para atualizar este usuário",
    });

  const existingNickname = await prisma.user.findFirst({
    where: { player: { nickname: inputBody.playerNickname } },
  });

  if (existingNickname) {
    throw new BadRequestError({
      message:
        existingNickname.id === requesterId
          ? "Você já definiu esse nickname"
          : "Este nickname já está registrado em uma conta",
    });
  }

  return next();
};

const handlePatch: Middleware<AuthenticatedContext> = async (req) => {
  const { birthDate, playerNickname } = req.context.inputBody;
  const { user } = req.context.session;

  try {
    await prisma.user.update({
      where: { id: user.id },
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

  return Response.json({ status: 200 });
};

controller.patch(handlePatchValidation, handlePatchAuthorization, handlePatch);
export const PATCH = controller.expose();
