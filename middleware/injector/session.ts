import type { Middleware } from "nextfastapi/types";
import { getServerSession } from "next-auth";
import { AnonymousRole, UserRole } from "@/lib/authorization/role";
import { registerRequesterCredentials } from "@/lib/authorization/accessControl";
import { FlowContext } from "../flow";
import { PayloadUser } from "@/types/next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const SessionInjector: Middleware<FlowContext> = async (req, _, next) => {
  const session = await getServerSession(authOptions);

  let requesterUser = {} as PayloadUser;
  let isAuthenticated = false;
  let requesterCredentialsManager = registerRequesterCredentials(AnonymousRole);

  if (session) {
    const user = session.user;

    if (user) {
      requesterUser = user;
      isAuthenticated = true;
      requesterCredentialsManager = registerRequesterCredentials(UserRole);
    }
  }

  const sessionInContext = {
    isAuthenticated,
    user: {
      ...requesterUser,
      canDo: requesterCredentialsManager,
    },
  };

  req.context.session = sessionInContext;

  return next();
};

export default SessionInjector;
