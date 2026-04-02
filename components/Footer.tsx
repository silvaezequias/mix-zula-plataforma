import { Activity, Trophy, Users } from "lucide-react";
import Container from "./ui/Container";
import { brand } from "@/config/brand";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 p-12 bg-black">
      <Container className=" flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3 opacity-50">
          <div className="bg-white p-1 transform -rotate-12">
            <Trophy size={16} className="text-black" />
          </div>
          <span className="text-sm font-black italic tracking-tighter uppercase">
            {brand.splittedName[0]}{" "}
            <span className="text-zinc-400">{brand.splittedName[1]}</span>
          </span>
        </div>
        <p className="text-[9px] text-zinc-700 font-bold text-center uppercase tracking-[0.4em]">
          © 2026 {brand.name} • TODOS OS DIREITOS RESERVADOS
        </p>
        <div className="flex gap-6">
          <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center hover:border-[#FFB300] transition-colors cursor-pointer text-zinc-600 hover:text-[#FFB300]">
            <Activity size={14} />
          </div>
          <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center hover:border-[#FFB300] transition-colors cursor-pointer text-zinc-600 hover:text-[#FFB300]">
            <Users size={14} />
          </div>
        </div>
      </Container>
    </footer>
  );
}
