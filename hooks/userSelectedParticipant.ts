"use client";

import { Participant } from "@prisma/client";
import { useState } from "react";

export function useSelectedParticipant<T = Participant>() {
  const [selectedParticipant, setSelectedParticipant] = useState<T | null>(
    null,
  );

  function selectParticipant(Participant: T) {
    setSelectedParticipant(Participant);
  }

  function clearParticipant() {
    setSelectedParticipant(null);
  }

  return {
    selectedParticipant,
    selectParticipant,
    clearParticipant,
    hasSelectedParticipant: !!selectedParticipant,
  };
}
