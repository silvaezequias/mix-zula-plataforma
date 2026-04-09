import { STAFF_ROLES } from "@/constants/data";
import {
  Ban,
  Check,
  ChevronRight,
  Loader2,
  ShieldAlert,
  UserCheck,
  UserMinus,
  X,
} from "lucide-react";
import { StaffRole } from "../../staff/StaffArea";
import { FullTournament } from "@/types";
import { useRef, useState, useTransition } from "react";
import {
  changeParticipantRole,
  removeParticipant,
} from "@/features/tournament/action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ActionButton } from "@/components/ui/ActionButton";

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

  const handleRoleChange = () => {
    if (!selectedUser || !selectedRole) return;

    startTransition(async () => {
      const response = await changeParticipantRole(
        tournament.id,
        selectedUser.user.id,
        selectedRole.id,
      );

      if (!response.success) {
        toast.error(response.error);
        setSelectedRole(STAFF_ROLES.find((r) => r.id === selectedUser.role));
      } else {
        router.refresh();
        selectedUser.role = selectedRole.id;
      }
    });
  };

  const handleKickoff = () => {
    if (!selectedUser) return;

    startTransition(async () => {
      const response = await removeParticipant(selectedUser.id);

      if (!response.success) {
        toast.error(response.error);
      } else {
        router.refresh();
        setSelectedUser(undefined);
      }
    });
  };

  const cantUpdateRole = selectedUser?.role === selectedRole?.id;

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
                    isUserRole={role.id === selectedUser.role}
                    handleRoleChange={() => {
                      if (!isPending) setSelectedRole(role);
                    }}
                  />
                ))}
                <ActionButton
                  disabled={isPending || cantUpdateRole}
                  onClick={handleRoleChange}
                  className="uppercase col-span-2 sm:col-span-3"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : cantUpdateRole ? (
                    <span className="flex gap-2 items-center">
                      Mude o cargo desse usuário
                    </span>
                  ) : (
                    <span className="flex gap-2 items-center">
                      Atualizar <ChevronRight />
                    </span>
                  )}
                </ActionButton>
              </div>
            </div>
            <PunishmentSection
              handleKickoff={handleKickoff}
              isLoading={isPending}
            />
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
  isUserRole,
  selectedRole,
  handleRoleChange,
}: {
  role: StaffRole;
  isUserRole: boolean;
  selectedRole?: StaffRole;
  handleRoleChange: (role: StaffRole) => void;
}) => {
  const isActive = selectedRole && selectedRole.id === role.id;

  return (
    <button
      onClick={() => handleRoleChange(role)}
      className={`aspect-square border-2 transition-all cursor-pointer group relative ${
        isActive
          ? "bg-primary border-primary text-black"
          : "bg-zinc-900/50 hover:border-zinc-700 text-zinc-400 " +
            (isUserRole ? "border-2 border-primary" : "border-zinc-800")
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
  isLoading,
  handleKickoff,
}: {
  isLoading: boolean;
  handleKickoff: () => void;
}) => {
  const [confirmKickoff, setConfirmKickoff] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);

  const kickoffTimeoutRef = useRef<null | NodeJS.Timeout>(null);
  const kickoffIntervalRef = useRef<null | NodeJS.Timeout>(null);

  const resetState = () => {
    setConfirmKickoff(false);
    setTimeLeft(3);

    if (kickoffTimeoutRef.current) {
      clearTimeout(kickoffTimeoutRef.current);
      kickoffTimeoutRef.current = null;
    }

    if (kickoffIntervalRef.current) {
      clearInterval(kickoffIntervalRef.current);
      kickoffIntervalRef.current = null;
    }
  };

  const startCountdown = () => {
    setConfirmKickoff(true);
    setTimeLeft(3);

    kickoffIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          resetState();
          return 3;
        }
        return prev - 1;
      });
    }, 1000);

    kickoffTimeoutRef.current = setTimeout(() => {
      resetState();
    }, 3000);
  };

  const handleKickoffClick = () => {
    if (!confirmKickoff) {
      startCountdown();
    } else {
      resetState();
      handleKickoff();
    }
  };

  useState(() => {
    return () => resetState();
  });

  return (
    <div className="space-y-6 px-10 w-full">
      <div className="grid grid-cols-1 gap-4 pb-10">
        <ActionButton
          onClick={handleKickoffClick}
          intent={confirmKickoff ? "danger" : "default"}
          variant={isLoading ? "ghost" : confirmKickoff ? "outline" : "solid"}
        >
          {isLoading ? (
            <span className="flex gap-2 items-center justify-center">
              <Loader2 size={18} className="animate-spin" />
              PROCESSANDO...
            </span>
          ) : confirmKickoff ? (
            <span className="flex gap-2 items-center justify-center">
              <Check size={18} />
              CONFIRMAR EXPULSÃO EM ({timeLeft}s)
            </span>
          ) : (
            <span className="flex gap-2 items-center justify-center">
              <UserMinus
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              EXPULSAR DO TORNEIO
            </span>
          )}
        </ActionButton>

        <ActionButton disabled>
          <Ban
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          BANIR USUÁRIO
        </ActionButton>
      </div>
    </div>
  );
};
