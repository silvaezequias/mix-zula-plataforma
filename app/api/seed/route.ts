import { seed } from "@/prisma/seed";

export const GET = async () => {
  await seed();
  return new Response("Seed executada com sucesso!");
};
