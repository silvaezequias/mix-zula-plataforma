"use client";

import {
  PARTICIPANT_STATUS,
  staffRolesMap,
  STAFF_ROLES,
} from "@/constants/data";
import { UserCheck, UserCog, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { Card } from "../settings/SettingsTab";
import { useCountdown } from "@/hooks/useCooldown";
import { LoadingAction, useUserActions } from "@/hooks/useUserActions";
import { ConfigDropdown } from "@/components/ui/components";
import {
  $Enums,
  Participant,
  ParticipantRole,
  ParticipantStatus,
} from "@prisma/client";
import { useSelectedParticipantContext } from "@/providers/SelectedParticipantContext";
import { useTabsContext } from "@/providers/TabContext";

export const UserTab = () => {
  const { clearParticipant, selectedParticipant } =
    useSelectedParticipantContext();
  const { changeTab } = useTabsContext();
  const { updateRole, updateStatus, kickoff, isLoading, loadingAction } =
    useUserActions(() => clearParticipant);

  const [selectedRoleId, setSelectedRoleId] = useState<
    ParticipantRole | undefined
  >(selectedParticipant?.role);

  const [selectedStatusId, setSelectedStatusId] = useState<
    ParticipantStatus | undefined
  >(selectedParticipant?.status);

  if (!selectedParticipant) return changeTab("participants");

  return (
    <div className="space-y-8">
      <TabHeader
        selectedParticipant={selectedParticipant}
        onClose={() => clearParticipant()}
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
              setSelectedRoleId={setSelectedRoleId}
              updateRole={updateRole}
              selectedParticipant={selectedParticipant}
            />

            <StatusSection
              selectedParticipant={selectedParticipant}
              isLoading={isLoading}
              loadingAction={loadingAction}
              selectedStatusId={selectedStatusId}
              setSelectedStatusId={setSelectedStatusId}
              updateStatus={updateStatus}
            />

            <KickSection
              disabled={isLoading}
              loading={loadingAction === "kick"}
              onKick={() => kickoff(selectedParticipant.id)}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

interface RoleSectionProps {
  selectedRoleId: ParticipantRole | undefined;
  selectedParticipant: Participant;
  isLoading: boolean;
  loadingAction: LoadingAction;
  setSelectedRoleId: Dispatch<
    SetStateAction<$Enums.ParticipantRole | undefined>
  >;
  updateRole: (participantId: string, roleId: ParticipantRole) => void;
}

const RoleSection = ({
  selectedRoleId,
  selectedParticipant,
  setSelectedRoleId,
  isLoading,
  loadingAction,
  updateRole,
}: RoleSectionProps) => {
  const { time, active, start, reset } = useCountdown(3);

  const isCurrent = selectedParticipant.role === selectedRoleId;
  const cantUpdate = isCurrent || isLoading;

  const handleUpdate = () => {
    if (!active) return start();

    reset();
    if (selectedRoleId && !cantUpdate) {
      updateRole(selectedParticipant.id, selectedRoleId);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ConfigDropdown
        options={Object.entries(staffRolesMap).map(([id]) => id)}
        labels={Object.entries(staffRolesMap).map(
          ([id]) => `${id}${selectedParticipant.role === id ? " (Atual)" : ""}`,
        )}
        value={selectedRoleId || selectedParticipant.role}
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
  selectedStatusId: ParticipantStatus | undefined;
  selectedParticipant: Participant;
  loadingAction: LoadingAction;
  setSelectedStatusId: Dispatch<
    SetStateAction<$Enums.ParticipantStatus | undefined>
  >;
  updateStatus: (userId: string, statusId: ParticipantStatus) => void;
}

const StatusSection = ({
  selectedStatusId,
  selectedParticipant,
  isLoading,
  loadingAction,
  setSelectedStatusId,
  updateStatus,
}: StatusSectionProps) => {
  const { time, active, start, reset } = useCountdown(3);

  const isCurrent = selectedParticipant.status === selectedStatusId;
  const cantUpdate = isCurrent || isLoading;

  const handleUpdate = () => {
    if (!active) return start();

    reset();
    if (selectedStatusId && !cantUpdate) {
      updateStatus(selectedParticipant.id, selectedStatusId);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ConfigDropdown
        options={PARTICIPANT_STATUS.map((r) => r.id)}
        labels={PARTICIPANT_STATUS.map(
          (r) =>
            `${r.title}${selectedParticipant.status === r.id ? " (Atual)" : ""}`,
        )}
        value={selectedStatusId || selectedParticipant.status}
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
  selectedParticipant: Participant;
  onClose: () => void;
}

const TabHeader = ({ selectedParticipant, onClose }: TabHeaderProps) => {
  const role = STAFF_ROLES.find((r) => r.id === selectedParticipant.role)!;

  return (
    <div className="bg-zinc-900 p-6 md:p-8 border-b border-zinc-800 flex items-center justify-between gap-6">
      <div className="flex items-center gap-6 flex-1">
        <div className="w-20 h-20 hidden md:flex bg-primary text-black text-3xl font-black italic items-center justify-center border-4 border-zinc-800 shadow-2xl relative">
          {selectedParticipant.name?.charAt(0)}

          <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 border-2 border-zinc-800">
            <UserCheck size={14} className="text-white" />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-2xl md:text-3xl font-black italic text-white tracking-tighter uppercase">
              {selectedParticipant.nickname}
            </span>

            <span
              className={`px-2 py-0.5 text-sm font-black italic tracking-widest uppercase ${role.color}`}
            >
              {role.title}
            </span>
          </div>
          <span className="text-primary text-xs md:text-sm font-black italic tracking-[0.3em] uppercase mt-1">
            {selectedParticipant.name}
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
