import {
  PARTICIPANT_STATUS,
  staffRolesMap,
  STAFF_ROLES,
} from "@/constants/data";
import { UserCheck, UserCog, X } from "lucide-react";
import { FullTournament } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { Card } from "./SettingsTab";
import { useCountdown } from "@/hooks/useCooldown";
import { LoadingAction, useUserActions } from "@/hooks/useUserActions";
import { ConfigDropdown } from "@/components/ui/components";
import { $Enums, ParticipantRole, ParticipantStatus } from "@prisma/client";

type Participant = FullTournament["participants"][number];
type SetSelectedUser = (user: Participant | undefined) => void;

export const UserTab = ({
  tournament,
  selectedUser,
  setSelectedUser,
}: {
  setSelectedUser: SetSelectedUser;
  selectedUser: Participant;
  tournament: FullTournament;
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<ParticipantRole>(
    selectedUser.role,
  );

  const [selectedStatusId, setSelectedStatusId] = useState<ParticipantStatus>(
    selectedUser.status,
  );

  const { updateRole, updateStatus, kickoff, isLoading, loadingAction } =
    useUserActions(() => setSelectedUser(undefined));

  return (
    <div className="space-y-8">
      <TabHeader
        selectedUser={selectedUser}
        onClose={() => setSelectedUser(undefined)}
      />

      <div className="columns-1 xl:columns-2 gap-8 space-y-8">
        <Card
          title="Controle de Usuário"
          icon={UserCog}
          className="break-inside-avoid mb-8"
        >
          <div className="grid grid-cols-2 gap-4">
            <RoleSection
              isLoading={isLoading}
              loadingAction={loadingAction}
              selectedRoleId={selectedRoleId}
              selectedUser={selectedUser}
              setSelectedRoleId={setSelectedRoleId}
              updateRole={updateRole}
            />

            <StatusSection
              isLoading={isLoading}
              loadingAction={loadingAction}
              selectedStatusId={selectedStatusId}
              selectedUser={selectedUser}
              setSelectedStatusId={setSelectedStatusId}
              updateStatus={updateStatus}
            />

            <KickSection
              disabled={isLoading}
              loading={loadingAction === "kick"}
              onKick={() => kickoff(selectedUser.id)}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

interface RoleSectionProps {
  selectedRoleId: ParticipantRole;
  selectedUser: Participant;
  isLoading: boolean;
  loadingAction: LoadingAction;
  setSelectedRoleId: Dispatch<SetStateAction<$Enums.ParticipantRole>>;
  updateRole: (participantId: string, roleId: ParticipantRole) => void;
}

const RoleSection = ({
  selectedRoleId,
  selectedUser,
  setSelectedRoleId,
  isLoading,
  loadingAction,
  updateRole,
}: RoleSectionProps) => {
  const { time, active, start, reset } = useCountdown(3);

  const isCurrent = selectedUser.role === selectedRoleId;
  const cantUpdate = isCurrent || isLoading;

  const handleUpdate = () => {
    if (!active) return start();

    reset();
    if (selectedRoleId && !cantUpdate) {
      updateRole(selectedUser.id, selectedRoleId);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ConfigDropdown
        options={Object.entries(staffRolesMap).map(([id]) => id)}
        labels={Object.entries(staffRolesMap).map(
          ([id]) => `${id}${selectedUser.role === id ? " (Atual)" : ""}`,
        )}
        value={selectedRoleId || selectedUser.role}
        label="Definição de Cargo"
        name="Cargos"
        onChange={(e) => setSelectedRoleId(e.target.value as ParticipantRole)}
      />

      <ActionButton
        className="uppercase"
        disabled={cantUpdate}
        onClick={handleUpdate}
        intent={active ? "success" : "default"}
      >
        {loadingAction === "role"
          ? "Processando..."
          : active
            ? `Confirmar atualização em (${time}s)`
            : "Atualizar Cargo"}
      </ActionButton>
    </div>
  );
};

interface StatusSectionProps {
  isLoading: boolean;
  selectedStatusId: ParticipantStatus;
  selectedUser: Participant;
  loadingAction: LoadingAction;
  setSelectedStatusId: Dispatch<SetStateAction<$Enums.ParticipantStatus>>;
  updateStatus: (userId: string, statusId: ParticipantStatus) => void;
}

const StatusSection = ({
  selectedStatusId,
  selectedUser,
  isLoading,
  loadingAction,
  setSelectedStatusId,
  updateStatus,
}: StatusSectionProps) => {
  const { time, active, start, reset } = useCountdown(3);

  const isCurrent = selectedUser.status === selectedStatusId;
  const cantUpdate = isCurrent || isLoading;

  const handleUpdate = () => {
    if (!active) return start();

    reset();
    if (selectedStatusId && !cantUpdate) {
      updateStatus(selectedUser.id, selectedStatusId);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ConfigDropdown
        options={PARTICIPANT_STATUS.map((r) => r.id)}
        labels={PARTICIPANT_STATUS.map(
          (r) => `${r.title}${selectedUser.status === r.id ? " (Atual)" : ""}`,
        )}
        value={selectedStatusId || selectedUser.status}
        label="Definição de Cargo"
        name="Cargos"
        onChange={(e) =>
          setSelectedStatusId(e.target.value as ParticipantStatus)
        }
      />

      <ActionButton
        className="uppercase"
        disabled={cantUpdate}
        onClick={handleUpdate}
        intent={active ? "success" : "default"}
      >
        {loadingAction === "status"
          ? "Processando..."
          : active
            ? `Confirmar atualização em (${time}s)`
            : "Atualizar Status"}
      </ActionButton>
    </div>
  );
};

interface TabHeaderProps {
  selectedUser: Participant;
  onClose: () => void;
}

const TabHeader = ({ selectedUser, onClose }: TabHeaderProps) => {
  const role = STAFF_ROLES.find((r) => r.id === selectedUser.role)!;

  return (
    <div className="bg-zinc-900 p-6 md:p-8 border-b border-zinc-800 flex items-center justify-between gap-6">
      <div className="flex items-center gap-6 flex-1">
        <div className="w-20 h-20 hidden md:flex bg-primary text-black text-3xl font-black italic items-center justify-center border-4 border-zinc-800 shadow-2xl relative">
          {selectedUser.user.name?.charAt(0)}

          <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 border-2 border-zinc-800">
            <UserCheck size={14} className="text-white" />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-2xl md:text-3xl font-black italic text-white tracking-tighter uppercase">
              {selectedUser.user.player?.nickname}
            </span>

            <span
              className={`px-2 py-0.5 text-sm font-black italic tracking-widest uppercase ${role.color}`}
            >
              {role.title}
            </span>
          </div>
          <span className="text-primary text-xs md:text-sm font-black italic tracking-[0.3em] uppercase mt-1">
            {selectedUser.user.name}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="text-zinc-600 hover:text-white transition-colors p-2"
        >
          <X size={28} />
        </button>
      </div>
    </div>
  );
};

interface KickSectionProps {
  loading: boolean;
  disabled: boolean;
  onKick: () => void;
}

function KickSection({ loading, onKick, disabled }: KickSectionProps) {
  const { time, active, start, reset } = useCountdown(3);

  const handleClick = () => {
    if (!active) return start();

    reset();
    onKick();
  };

  return (
    <ActionButton
      onClick={handleClick}
      disabled={disabled}
      className="uppercase"
      intent={active ? "danger" : "default"}
    >
      {loading
        ? "Processando..."
        : active
          ? `Confirmar explulsão em (${time}s)`
          : "Expulsar do Torneio"}
    </ActionButton>
  );
}
