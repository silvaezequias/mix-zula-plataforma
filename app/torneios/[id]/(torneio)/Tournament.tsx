"use server";

import { Page } from "@/components/Page";
import { TabsProvider } from "@/providers/TabContext";
import { SelectedParticipantProvider } from "@/providers/SelectedParticipantContext";
import { TournamentHeader } from "./TournamentHeader";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";
import { redirect } from "next/navigation";
import {
  Ban,
  Medal,
  Radio,
  Settings,
  Shuffle,
  UserRoundPlus,
} from "lucide-react";
import { JSX } from "react";
import { Participant, TournamentStatus } from "@prisma/client";
import { Sidebar } from "@/components/Sidebar";
import { getTournamentParticipantsAction } from "@/features/tournament/action/feed/getTournamentParticipantsAction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTournamentMemberAction } from "@/features/tournament/action/feed/getTournamentMemberAction";

type LayoutProps = {
  children: React.ReactNode;
  tournamentId: string;
};

export async function TournamentSection({
  children,
  tournamentId,
}: LayoutProps) {
  const { data: tournament } = await getTournamentOverviewAction(tournamentId);
  const { data: participants } =
    await getTournamentParticipantsAction(tournamentId);

  if (!tournament) {
    return redirect(`/torneios/nao-encontrado?id=${tournamentId}`);
  }

  let staff: Participant[] = [];

  if (participants) {
    staff = participants.filter((p) => p.role && p.role !== "PLAYER");
  }

  const session = await getServerSession(authOptions);

  let isStaff = false;
  let participant: Participant | undefined = undefined;

  if (session) {
    const { data } = await getTournamentMemberAction(
      tournamentId,
      session.user.id,
    );

    if (data) {
      participant = data;
      isStaff = staff.some((s) => s.id === participant?.id);
    }
  }

  const statusMap: Record<
    TournamentStatus,
    {
      label: string;
      className: string;
      icon: JSX.ElementType;
    }
  > = {
    LIVE: {
      label: "EM ANDAMENTO",
      className: "border-indigo-600 text-indigo-600",
      icon: Radio,
    },
    READY: {
      label: "PREPARANDO PARA INÍCIO",
      className: "border-emerald-600 text-emerald-400",
      icon: Radio,
    },
    OPEN: {
      label: "INCRIÇÕES ABERTAS",
      className: "border-green-600 text-green-400",
      icon: UserRoundPlus,
    },
    SETTING_TEAM: {
      label: "DEFININDO EQUIPES",
      className: "border-yellow-600 text-yellow-400",
      icon: Shuffle,
    },
    SETTING_MATCHES: {
      label: "DEFININDO JOGOS",
      className: "border-sky-600 text-sky-400",
      icon: Shuffle,
    },
    FINISHED: {
      label: "FINALIZADO",
      className: "border-red-600 text-red-400",
      icon: Medal,
    },
    CLOSED: {
      label: "FECHADO",
      className: "border-red-800 text-red-400",
      icon: Ban,
    },
  } as const;

  const status = statusMap[tournament.status] || {
    label: "STATUS DESCONHECIDO",
    className: "border-gray-600 text-gray-400",
    icon: Settings,
  };

  return (
    <Page>
      <TabsProvider>
        <SelectedParticipantProvider>
          <div className="max-w-480 mx-auto h-screen max-h-screen flex flex-col lg:flex-row">
            <main className="flex-1 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_left,#111_0%,#050505_100%)] order-2 lg:order-1">
              <TournamentHeader />

              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div className="hidden md:inline-block bg-primary text-black px-4 py-1 text-[12px] font-black mb-4 skew-x-[-15deg]">
                    <span className="inline-block skew-x-15">
                      INFORMAÇÕES DO TORNEIO
                    </span>
                  </div>
                  <div
                    className={`inline-block ${status.className} border-2 px-4 py-1 text-[12px] font-black mb-4 skew-x-15`}
                  >
                    <span className="inline-block skew-x-[-15deg]">
                      {status.label}
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter leading-none mb-6 uppercase">
                  {tournament.title}
                </h1>

                {children}
              </div>
            </main>

            <Sidebar
              sessionMember={participant}
              tournament={tournament}
              staff={staff}
              isStaff={isStaff}
            />
          </div>
        </SelectedParticipantProvider>
      </TabsProvider>
    </Page>
  );
}
