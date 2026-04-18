"use client";

import { JSX } from "react";
import { RequestStaffRole } from "./RequestStaffRole";
import { FullTournament } from "@/types";
import { ParticipantRole, ParticipantStatus } from "@prisma/client";
import { PayloadUser } from "@/types/next-auth";
import Container from "@/components/ui/Container";
import { STAFF_ROLES } from "@/constants/data";

export type StaffRole = {
  id: ParticipantRole;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  bg: string;
  level: number;
};

export type ParticipantStatusObject = {
  id: ParticipantStatus;
  title: string;
  description: string;
  color: string;
  bg: string;
};

export default function StaffInvitationPage({
  user,
  tournament,
}: {
  user: PayloadUser;
  tournament: FullTournament;
}) {
  return (
    <Container>
      <RequestStaffRole
        availableRoles={STAFF_ROLES}
        user={user}
        tournament={tournament}
      />
    </Container>
  );
}
