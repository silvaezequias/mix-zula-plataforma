import { PayloadUser } from "@/types/next-auth";
import {
  Ban,
  ChevronRight,
  MessageSquareOff,
  Shield,
  UserMinus,
  X,
} from "lucide-react";

interface UserModalProps {
  user: PayloadUser;
  onClose: () => void;
  onOpenRoleModal: () => void;
}

export const UserManagementModal: React.FC<UserModalProps> = ({
  user,
  onClose,
  onOpenRoleModal,
}) => (
  <div className="fixed inset-0 z-140 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-sm uppercase italic">
    <div className="bg-[#111] border-2 border-zinc-800 w-full max-w-md overflow-hidden shadow-2xl relative">
      <div className="bg-zinc-900 p-6 border-b border-zinc-800 relative italic">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-600 hover:text-white"
        >
          <X size={20} />
        </button>
        <div className="flex items-center gap-4 italic">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary text-black text-2xl font-black italic flex items-center justify-center border-4 border-zinc-800 shadow-xl">
            {user.player?.nickname.charAt(0)}
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 italic">
              <span className="text-lg sm:text-xl font-black italic text-white tracking-tighter uppercase truncate w-32 sm:w-auto">
                {user.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-zinc-600 font-bold opacity-60 italic truncate">
                #{user.discordId}
              </span>
            </div>
            <span className="text-primary text-xs font-black italic tracking-widest uppercase mt-1">
              CARGO ATUAL: TODO: CARGO ATUAL AQUI
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-4 uppercase italic">
        <h4 className="text-[10px] font-black text-zinc-500 tracking-widest mb-4 italic uppercase">
          GESTÃO DE USUÁRIO
        </h4>

        <button
          onClick={onOpenRoleModal}
          className="w-full flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 hover:border-primary transition-colors group italic"
        >
          <span className="flex items-center gap-3 text-xs font-black italic uppercase">
            <Shield size={16} className="text-primary" /> ALTERAR CARGO / STAFF
          </span>
          <ChevronRight size={14} className="text-zinc-700" />
        </button>

        <div className="grid grid-cols-2 gap-4 italic">
          <button className="flex items-center justify-center gap-2 p-4 bg-orange-950/20 border border-orange-900/50 text-orange-500 hover:bg-orange-600 hover:text-white transition-all text-[10px] font-black uppercase italic">
            <UserMinus size={14} /> EXPULSAR
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-red-950/20 border border-red-900/50 text-red-500 hover:bg-red-600 hover:text-white transition-all text-[10px] font-black uppercase italic">
            <Ban size={14} /> BANIR
          </button>
        </div>
        <button className="w-full flex items-center justify-center gap-3 p-4 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase italic">
          <MessageSquareOff size={14} /> SILENCIAR ACESSO
        </button>
      </div>
    </div>
  </div>
);
