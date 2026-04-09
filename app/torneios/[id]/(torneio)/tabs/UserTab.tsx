import { STAFF_ROLES } from "@/constants/data";
import {
  Ban,
  Check,
  MessageSquareOff,
  ShieldAlert,
  UserCheck,
  UserMinus,
  X,
} from "lucide-react";
import { StaffRole } from "../../staff/StaffArea";
import { FullTournament } from "@/types";
import { useState, useTransition } from "react";
import {
  changeParticipantRole,
  removeParticipant,
} from "@/features/tournament/action";
import { toast } from "react-toastify";
import { ParticipantRole } from "@prisma/client";
import { useRouter } from "next/navigation";

export const UserTab = ({
  tournament,
  selectedUser,
  setSelectedUser,
}: {
  setSelectedUser: (
    user: FullTournament["participants"][number] | undefined,
  ) => void;
  selectedUser: FullTournament["participants"][number];
  tournament: FullTournament;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<StaffRole | undefined>(
    STAFF_ROLES.find((r) => r.id === selectedUser.role),
  );

  const handleRoleChange = (roleId: ParticipantRole) => {
    if (!selectedUser) return;

    startTransition(async () => {
      const response = await changeParticipantRole(
        tournament.id,
        selectedUser.user.id,
        roleId,
      );

      if (!response.success) toast.error(response.error);
      else router.refresh();
    });
  };

  const handleKickoff = () => {
    if (!selectedUser) return;

    startTransition(async () => {
      const response = await removeParticipant(selectedUser.id);
      if (!response.success) toast.error(response.error);
      else router.refresh();
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 gap-8">
      <div className="animate-in fade-in duration-500 space-y-6 w-full">
        <div className="bg-[#111] border-2 border-zinc-800 overflow-hidden shadow-2xl w-full">
          <div className="bg-zinc-900 p-8 border-b border-zinc-800 relative flex items-center justify-between">
            <div className="flex items-center gap-6 ">
              <div className="w-24 h-24 hidden md:flex bg-primary text-black text-4xl font-black italic items-center justify-center border-4 border-zinc-800 shadow-2xl relative group">
                {selectedUser.user.name?.charAt(0)}
                <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 border-2 border-zinc-800">
                  <UserCheck size={14} className="text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black italic text-white tracking-tighter uppercase">
                    {selectedUser.user.player?.nickname}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-primary text-sm font-black italic tracking-[0.3em] uppercase">
                    {selectedUser.user.name}
                  </span>
                  <div
                    className={`px-2 py-0.5 border text-[8px] font-black italic tracking-widest uppercase ${selectedUser.role !== "PLAYER" ? "bg-primary text-black border-primary" : "bg-zinc-800 text-zinc-500 border-zinc-700"}`}
                  >
                    {selectedUser.role}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedUser(undefined)}
              className="text-zinc-600 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase italic transition-colors"
            >
              <X size={16} /> Fechar Painel
            </button>
          </div>

          <div className="p-10 space-y-12 grid grid-cols-1 xl:grid-cols-2 place-items-center gap-10 border">
            <div className="space-y-6 w-full ">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-primary"></div>
                <h4 className="text-[10px] font-black text-white tracking-[0.4em] uppercase italic">
                  Sistema de Cargos
                </h4>
              </div>

              <div
                className={`grid grid-cols-2 sm:grid-cols-3 gap-4 ${isPending ? "opacity-70" : ""}`}
              >
                {STAFF_ROLES.map((role) => (
                  <RoleSection
                    key={role.id}
                    role={role}
                    selectedRole={selectedRole}
                    handleRoleChange={() => {
                      if (!isPending) {
                        handleRoleChange(role.id);
                        setSelectedRole(role);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
            <PunishmentSection handleKickoff={handleKickoff} />
          </div>

          <div className="bg-zinc-900/50 p-6 flex items-center gap-3 border-t border-zinc-800 italic">
            <ShieldAlert size={16} className="text-zinc-600" />
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
              CUIDADO: ALTERAÇÕES DE CARGO AFETAM IMEDIATAMENTE AS PERMISSÕES DE
              ACESSO NA PLATAFORMA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoleSection = ({
  role,
  selectedRole,
  handleRoleChange,
}: {
  role: StaffRole;
  selectedRole?: StaffRole;
  handleRoleChange: (role: StaffRole) => void;
}) => {
  const isActive = selectedRole && selectedRole.id === role.id;

  return (
    <button
      onClick={() => handleRoleChange(role)}
      className={`aspect-square border-2 transition-all group relative ${
        isActive
          ? "bg-primary border-primary text-black"
          : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-400"
      }`}
    >
      <span
        className={`flex flex-col items-center justify-center gap-4 ${isActive ? "text-black" : role.color}`}
      >
        {role.icon}
        <span className="text-sm md:text-md font-black italic tracking-tighter uppercase">
          {role.title}
        </span>
        {isActive && (
          <div className="absolute top-2 right-2">
            <Check className="text-black size-5" strokeWidth={3} />
          </div>
        )}
      </span>
    </button>
  );
};

const PunishmentSection = ({
  handleKickoff,
}: {
  handleKickoff: () => void;
}) => {
  return (
    <div className="space-y-6 px-10 w-full">
      <div className="grid grid-cols-1  gap-4 pb-10">
        <button
          onClick={handleKickoff}
          className="flex items-center justify-center gap-3 p-5 bg-orange-950/10 border border-orange-900/30 text-orange-500 hover:bg-orange-600 hover:text-white transition-all text-[10px] font-black italic uppercase group"
        >
          <UserMinus
            size={18}
            className="group-hover:scale-110 transition-transform"
          />{" "}
          EXPULSAR DO TORNEIO
        </button>
        <button className="flex items-center justify-center gap-3 p-5 bg-red-950/10 border border-red-900/30 text-red-500 hover:bg-red-600 hover:text-white transition-all text-[10px] font-black italic uppercase group">
          <Ban
            size={18}
            className="group-hover:scale-110 transition-transform"
          />{" "}
          BANIMENTO DO TORNEIO
        </button>
        <button className="flex items-center justify-center gap-3 p-5 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-all text-[10px] font-black italic uppercase group">
          <MessageSquareOff
            size={18}
            className="text-zinc-700 group-hover:text-zinc-300"
          />{" "}
          SILENCIAR AGENTE
        </button>
      </div>
    </div>
  );
};
