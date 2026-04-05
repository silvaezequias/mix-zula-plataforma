"use server";

import Link from "next/link";
import Container from "../ui/Container";
import { Logo } from "../Brand";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "lucide-react";
import { Navigation } from "./Navigation";

export async function Header({
  additionalElement,
}: {
  additionalElement?: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;

  const routes = [
    { name: "INÍCIO", href: "/" },
    { name: "TORNEIOS", href: "/torneios" },
    { name: "Contato", href: "/contato" },
    ...(isAuthenticated
      ? [{ name: "Atualizar Cadastro", href: "/atualizar-cadastro" }]
      : []),
  ];

  return (
    <nav className="px-6 lg:px-12 border-b border-zinc-900 bg-black/50 backdrop-blur-md z-50">
      <Container className="flex items-center justify-between py-6">
        <Logo />

        {/* CLIENT COMPONENT só para active route */}
        <div className="hidden md:flex items-center gap-8">
          <Navigation routes={routes} />
        </div>

        {isAuthenticated ? (
          <div className="font-semibold text-primary uppercase">
            <span className="md:hidden bg-primary text-primary-foreground font-black rounded-full aspect-square flex justify-center items-center h-10 px-2">
              {session.user.name}
            </span>

            <span className="hidden md:flex items-center gap-2">
              <User size={15} />
              {session.user.name}
            </span>
          </div>
        ) : (
          <Link
            href="/login"
            className="border border-primary hidden lg:inline-block uppercase text-primary px-6 py-2 text-[10px] font-black hover:bg-primary hover:text-black transition-all"
          >
            Entrar com Discord
          </Link>
        )}

        {additionalElement}
      </Container>
    </nav>
  );
}
