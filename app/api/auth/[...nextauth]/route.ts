import NextAuth, { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/infra/prisma";
import { parseDateString } from "@/lib/formatter";

const { DISCORD_CLIENT_ID = "", DISCORD_CLIENT_SECRET = "" } = process.env;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
  throw new Error("Missing Discord env variables");
}

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
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        const discordId =
          account?.provider === "discord" ? account.providerAccountId : null;

        token.discordId = discordId ?? token.discordId ?? null;
        token.id = user.id;
        token.name = user.name;

        const storedUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isOnboarded: true, player: true, birthDate: true },
        });

        if (storedUser) {
          token.isOnboarded = storedUser.isOnboarded ?? false;
          token.player = storedUser.player ?? null;
          token.birthDate = storedUser.birthDate
            ? parseDateString(storedUser.birthDate)
            : null;
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
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
