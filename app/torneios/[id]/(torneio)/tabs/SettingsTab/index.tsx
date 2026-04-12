import { FullTournament } from "@/types";
import { Tournament } from "@prisma/client";
import { JSX, useState } from "react";
import { AboutTournament } from "./AboutTournament";
import { PresenceConfirmation } from "./PresenceConfirmationSection";
import { BroadcastSection } from "./BroadcastSection";
import { ParametersSection } from "./ParametersSection";
import { ActionsSection } from "./ActionsSection";
import { UpdateSection } from "./UpdateSection";
import { useTournamentActions } from "@/hooks/useTournamentAction";

type SettingsTabProps = {
  tournament: FullTournament;
  isRandomizing: boolean;
  handleRandomize: () => void;
};

export type HandleTournamentChange = <T extends keyof Tournament>(
  key: T,
  value: Tournament[T],
) => void;

export type HandleTournamentToggle = <
  T extends keyof Pick<
    Tournament,
    "confirmationSystem" | "hasSubstitutes" | "swapTeam"
  >,
>(
  key: T,
) => void;

export const SettingsTab = (props: SettingsTabProps) => {
  const { isLoading, updateAll } = useTournamentActions(props.tournament.id);
  const { handleRandomize } = props;

  const [dirtyFields, setDirtyFields] = useState<
    Partial<Record<keyof Tournament, boolean>>
  >({});

  const [tournament, setTournament] = useState<FullTournament>(
    props.tournament,
  );

  const handleTournamentChange: HandleTournamentChange = (key, value) => {
    setTournament((prev) => {
      const newState = { ...prev, [key]: value };

      const normalizeValue = (value: unknown) => {
        if (
          value === null ||
          value === undefined ||
          (typeof value === "string" && value.trim() === "")
        ) {
          return null;
        }

        return value;
      };

      setDirtyFields((prevDirty) => {
        const isSameAsInitial =
          normalizeValue(props.tournament[key]) === normalizeValue(value);

        if (isSameAsInitial) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: _, ...rest } = prevDirty;
          return rest;
        }

        return {
          ...prevDirty,
          [key]: true,
        };
      });

      return newState;
    });
  };

  const handleTournamentToggle: HandleTournamentToggle = (key) => {
    if (typeof tournament[key] === "boolean") {
      handleTournamentChange(key, !tournament[key]);
    }
  };

  const hasChanged = Boolean(Object.keys(dirtyFields).length);

  const handleSubmit = () => {
    if (hasChanged) {
      const payload: Partial<Tournament> = {};

      (Object.keys(dirtyFields) as (keyof Tournament)[]).forEach((key) => {
        payload[key] = tournament[key] as never;
      });

      updateAll(payload, () => {
        setDirtyFields({});
      });
    }
  };

  const handleUndo = () => {
    if (hasChanged) {
      setTournament(props.tournament);
      setDirtyFields({});
    }
  };

  return (
    <div className="columns-1 gap-8 xl:columns-3 animate-in fade-in duration-500">
      <div className="break-inside-avoid mb-8">
        <AboutTournament
          title={tournament.title}
          description={tournament.description}
          prize={tournament.prize}
          handleChange={handleTournamentChange}
        />
      </div>
      <div className="break-inside-avoid mb-8">
        <PresenceConfirmation
          handleChange={handleTournamentChange}
          handleToggle={handleTournamentToggle}
          confirmationSystem={tournament.confirmationSystem}
          confirmationTime={tournament.confirmationTime}
          hasSubstitutes={tournament.hasSubstitutes}
          substitutesLimit={tournament.substitutesLimit}
        />
      </div>
      <div className="break-inside-avoid mb-8">
        <ParametersSection
          handleChange={handleTournamentChange}
          handleToggle={handleTournamentToggle}
          gameMode={tournament.gameMode}
          matchesPerMatch={tournament.matchesPerMatch}
          maxPlayers={tournament.maxPlayers}
          maxRegistrations={tournament.maxRegistrations}
          playersPerTeam={tournament.playersPerTeam}
          statsType={tournament.statsType}
          swapTeam={tournament.swapTeam}
          teamManagement={tournament.teamManagement}
          totalTeams={tournament.totalTeams}
        />
      </div>
      <div className="break-inside-avoid mb-8">
        <BroadcastSection
          handleChange={handleTournamentChange}
          broadcastPlatform={tournament.broadcastPlatform}
          broadcastUrl={tournament.broadcastUrl}
        />
      </div>
      <div className="break-inside-avoid mb-8">
        <ActionsSection
          status={tournament.status}
          handleRandomize={handleRandomize}
          handleChange={handleTournamentChange}
          tournamentCurrentStatus={props.tournament.status}
        />
      </div>
      <div className="break-inside-avoid mb-8">
        <UpdateSection
          disabled={!hasChanged}
          isLoading={isLoading}
          handleUpdate={handleSubmit}
          handleUndo={handleUndo}
        />
      </div>
    </div>
  );
};

export const Card = ({
  title,
  children,
  icon: Icon,
  className,
}: {
  title: string;
  children: React.ReactNode;
  icon: JSX.ElementType;
  className?: string;
}) => {
  return (
    <div
      className={`space-y-8 bg-[#111] border border-zinc-800 p-8 shadow-2xl relative overflow-hidden ${className || ""}`}
    >
      <div className="flex items-center gap-3 text-primary">
        <Icon size={20} />
        <h3 className="text-xl font-bold italic tracking-tighter uppercase">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
};
