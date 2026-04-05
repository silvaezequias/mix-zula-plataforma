"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation({
  routes,
}: {
  routes: { name: string; href: string }[];
}) {
  const pathname = usePathname();

  return (
    <>
      {routes.map((route) => {
        const isActive = pathname === route.href;

        return (
          <Link
            key={route.href}
            href={route.href}
            className={`text-[10px] font-black uppercase transition-opacity ${
              isActive ? "text-primary" : "text-zinc-500 hover:opacity-80"
            }`}
          >
            {route.name}
          </Link>
        );
      })}
    </>
  );
}
