import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Container from "./ui/Container";
import { Logo } from "./Brand";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";

export function Header({
  additionalElement,
}: {
  additionalElement?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const routes = [
    { name: "INÍCIO", href: "/" },
    { name: "TORNEIOS", href: "/torneios" },
    { name: "Contato", href: "/contato" },
  ];

  return (
    <nav className="px-6 lg:px-12 border-b border-zinc-900 bg-black/50 backdrop-blur-md z-50">
      <Container className="flex items-center justify-between py-6">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          {routes.map((route) => {
            const isActive = pathname === route.href;

            return (
              <Link
                key={route.href}
                href={route.href}
                className={`text-[10px] font-black transition-opacity uppercase ${
                  isActive ? "text-primary" : "text-zinc-500 hover:opacity-80"
                }`}
              >
                {route.name}
              </Link>
            );
          })}
        </div>
        {status !== "loading" &&
          (isAuthenticated ? (
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
            <button
              onClick={() => router.push("/login")}
              className="border border-primary hidden lg:inline-block uppercase text-primary px-6 py-2 text-[10px] font-black hover:bg-primary hover:text-black transition-all"
            >
              Entrar com Discord
            </button>
          ))}
        {additionalElement}
      </Container>
    </nav>
  );
}
