"use client";

import { Participant } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

type CustomParticipant = Participant;

type SelectedParticipantContextType<T = CustomParticipant> = {
  selectedParticipant: T | null;
  selectParticipant: (participant: T) => void;
  clearParticipant: () => void;
};

const SelectedParticipantContext =
  createContext<SelectedParticipantContextType | null>(null);

export function SelectedParticipantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [selectedParticipant, setSelectedParticipant] =
    useState<CustomParticipant | null>(null);

  function selectParticipant(participant: CustomParticipant) {
    router.push(`/torneios/${params.id}/user/${participant.userId}`);
    setSelectedParticipant(participant);
  }

  function clearParticipant() {
    setSelectedParticipant(null);
  }

  return (
    <SelectedParticipantContext.Provider
      value={{ selectedParticipant, selectParticipant, clearParticipant }}
    >
      {children}
    </SelectedParticipantContext.Provider>
  );
}

export function useSelectedParticipantContext<T = CustomParticipant>() {
  const ctx = useContext(SelectedParticipantContext);

  if (!ctx) {
    throw new Error(
      "useSelectedParticipantContext precisa estar dentro do SelectedParticipantProvider",
    );
  }

  return ctx as unknown as SelectedParticipantContextType<T>;
}
