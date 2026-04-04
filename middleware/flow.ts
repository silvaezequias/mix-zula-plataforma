import { Credentials } from "@/lib/authorization/credentials";
import { PayloadUser } from "@/types/next-auth";

export type AnonymousSession = {
  session: {
    isAuthenticated: false;
    user: {
      canDo: (credential: Credentials) => boolean;
    };
  };
};

export type AuthenticatedSession = {
  session: {
    isAuthenticated: true;
    user: PayloadUser & {
      canDo: (credential: Credentials) => boolean;
    };
  };
};

export type PassportSession = AnonymousSession | AuthenticatedSession;
export type FlowContext = PassportSession & Record<string, unknown>;
