import NextAuth, { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/infra/prisma";

const { DISCORD_CLIENT_ID = "", DISCORD_CLIENT_SECRET = "" } = process.env;

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: "identify email" } },
    }),
  ],

  session: { strategy: "jwt" },
  events: {
    async signIn({ user, account }) {
      if (user.email && account?.provider === "discord") {
        await prisma.user.update({
          where: { email: user.email },
          data: { discordId: account.providerAccountId },
        });
      }
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "discord") {
          token.discordId = account.providerAccountId;
        }

        token.id = user.id;
        token.name = user.name;

        const storedUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isOnboarded: true, player: true, birthDate: true },
        });

        if (storedUser) {
          token.isOnboarded = storedUser.isOnboarded ?? false;
          token.player = storedUser.player ?? null;
          token.birthDate = storedUser.birthDate ? storedUser.birthDate : null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isOnboarded = token.isOnboarded ?? false;
        session.user.player = token.player ?? null;
        session.user.birthDate = token.birthDate ?? null;
        session.user.discordId = token.discordId ?? null;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
