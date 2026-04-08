"use client";

import { JSX } from "react";
import { Shield, Users, Radio, Target } from "lucide-react";
import { RequestStaffRole } from "./RequestStaffRole";
import { FullTournament } from "@/types";
import { ParticipantRole } from "@prisma/client";
import { PayloadUser } from "@/types/next-auth";
import Container from "@/components/ui/Container";

export type StaffRole = {
  id: ParticipantRole;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  bg: string;
};

const STAFF_ROLES: StaffRole[] = [
  {
    id: "MODERADOR",
    title: "Moderador",
    description:
      "Responsável pela ordem geral, Discord e cumprimento das condutas éticas dos agentes.",
    icon: <Shield size={24} />,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    id: "JUIZ",
    title: "Juiz",
    description:
      "Monitoria direta das partidas, validação de KDA e resolução de conflitos técnicos in-game.",
    icon: <Target size={24} />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "STREAMER",
    title: "Streamer",
    description:
      "Voz oficial do Torneio. Narrador de comabtes e responsável pela transmissão ao vivo dos jogos.",
    icon: <Radio size={24} />,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "AJUDANTE",
    title: "Ajudante",
    description:
      "Suporte na organização, inscrições e auxílio geral aos jogadores.",
    icon: <Users size={24} />,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

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
