import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Container from "./ui/Container";
import { Logo } from "./Brand";

export function Header({
  additionalElement,
}: {
  additionalElement?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const routes = [
    { name: "INÍCIO", href: "/" },
    { name: "TORNEIOS", href: "/torneios" },
    { name: "Contato", href: "/contato" },
  ];

  return (
    <nav className="h-20 px-6 lg:px-12 border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <Container className="flex items-center justify-center md:justify-between py-6">
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

        <button
          onClick={() => router.push("/login")}
          className="border hidden lg:inline-block border-primary uppercase text-primary px-6 py-2 text-[10px] font-black hover:bg-primary hover:text-black transition-all"
        >
          Entrar com Discord
        </button>
        {additionalElement}
      </Container>
    </nav>
  );
}
