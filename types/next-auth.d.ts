// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
import { Player } from "@prisma/client";

export type PayloadUser = {
  id: string;
  discordId: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isOnboarded: boolean;
  player: Player | null;
  birthDate: string | null;
};

declare module "next-auth" {
  interface Session {
    user: PayloadUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends PayloadUser {
    id: string;
  }
}
