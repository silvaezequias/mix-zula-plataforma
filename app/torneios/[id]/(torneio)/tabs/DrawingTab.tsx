import { Championship, Player } from "@/types";
import { Users } from "lucide-react";

export type DrawingTabProps = {
  championship: Championship;
  isRandomizing: boolean;
  onManageUser: (player: Player) => void;
};

export const DrawingTab = (props: DrawingTabProps) => {
  const { championship, isRandomizing, onManageUser } = props;
  const isStaff = true; // TODO: substituir pela verificação real de permissão

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      {isRandomizing && (
        <div className="py-20 sm:py-32 text-center bg-[#111] border border-zinc-800 relative overflow-hidden uppercase italic tracking-widest">
          <div className="absolute inset-0 bg-[#FFB300]/5 animate-pulse"></div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#FFB300] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h4 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-[#FFB300]">
            PROCESSANDO SORTEIO
          </h4>
          <p className="text-zinc-500 text-[10px] font-bold mt-2 uppercase tracking-[0.5em] italic">
            Aguarde a geração...
          </p>
        </div>
      )}
    </div>
  );
};
