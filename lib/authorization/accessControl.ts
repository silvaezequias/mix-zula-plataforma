import { getServerSession } from "next-auth";

import { Credentials } from "./credentials";
import { Roles } from "./role";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  RedirectSearchParams,
  RequestWithSearchParams,
} from "@/types/frontend";
import { UnauthorizedError } from "nextfastapi/errors";

export function registerRequesterCredentials(role: Roles) {
  return function requesterCanDo(credential: Credentials) {
    return role.credentials.includes(credential);
  };
}

export async function requireAuth<SP extends RedirectSearchParams>(
  req?: RequestWithSearchParams<SP>,
) {
  const searchParams = (await req?.searchParams) ?? ({} as SP);
  const redirectUrl = searchParams.redirect ?? "/";

  const session = await getServerSession(authOptions);

  if (!session) {
    const encoded = encodeURIComponent(redirectUrl);
    redirect(`/login?redirect=${encoded}`, "replace");
  }

  return { session, searchParams };
}

export async function getAuthOrThrow() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new UnauthorizedError({
      message: "Você não tem permissão para acessar essa área.",
    });
  }

  if (!session.user.discordId) {
    throw new UnauthorizedError({
      message: "Sua sessão está inválida. Por favor faça login novamente.",
    });
  }

  return session;
}
