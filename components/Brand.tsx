import { brand } from "@/config/brand";
import { Trophy } from "lucide-react";
import Link from "next/link";

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:inline-block bg-primary p-1.5 transform -rotate-12 shadow-[0_0_15px_rgba(255,179,0,0.3)]">
        <Trophy size={20} className="text-black" />
      </div>
      <Link href="/">
        <span className="text-2xl font-black italic tracking-tighter uppercase">
          {brand.splittedName[0]}{" "}
          <span className="text-primary">{brand.splittedName[1]}</span>
        </span>
      </Link>
    </div>
  );
};
