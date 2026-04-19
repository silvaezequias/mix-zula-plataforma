import { Tab, Window } from "@/components/ui/Window";
import { TabKey, TabsProvider } from "@/providers/TabContext";
import { TournamentSection } from "./Tournament";
import { MobileMenuProvider } from "@/providers/MobileMenuContext";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTournamentMemberAction } from "@/features/tournament/action/feed/getTournamentMemberAction";
import { staffRolesMap } from "@/constants/data";
import { canShow } from "./_protect-flow";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function Layout(props: LayoutProps) {
  const { id: tournamentId } = await props.params;
  const session = await getServerSession(authOptions);

  const tabsOrder: TabKey[] = [
    "overview",
    "participants",
    "teams",
    "matches",
    "staff",
    "user",
    "webhooks",
    "settings",
  ];

  const tabs: Tab[] = [
    {
      id: "overview",
      label: "Geral",
      href: `/torneios/${tournamentId}/overview`,
    },
  ];
  const { data: tournament, success } =
    await getTournamentOverviewAction(tournamentId);

  if (!success || !tournament) {
    return redirect(`/torneios/nao-encontrado?id=${tournamentId}`);
  }

  if (canShow("teams", tournament)) {
    tabs.push({
      id: "teams",
      label: "Equipes",
      href: `/torneios/${tournamentId}/teams`,
    });
  }

  if (canShow("matches", tournament)) {
    tabs.push({
      id: "matches",
      label: "Jogos",
      href: `/torneios/${tournamentId}/matches`,
    });
  }

  if (session) {
    const { data: participant } = await getTournamentMemberAction(
      tournamentId,
      session.user.id,
    );

    if (participant) {
      const participantRole = staffRolesMap[participant.role];

      tabs.push({
        id: "participants",
        label: "Participantes",
        href: `/torneios/${tournamentId}/participants`,
      });

      if (participantRole.level > 3) {
        tabs.push({
          id: "staff",
          label: "Staff",
          href: `/torneios/${tournamentId}/staff`,
        });
      }

      if (participantRole.level > 5) {
        tabs.push({
          id: "webhooks",
          label: "Discord Webhooks",
          href: `/torneios/${tournamentId}/webhooks`,
        });
      }

      if (participantRole.level > 8) {
        tabs.push({
          id: "settings",
          label: "Configurações",
          href: `/torneios/${tournamentId}/settings`,
        });
      }
    }
  }

  return (
    <TabsProvider>
      <MobileMenuProvider>
        <TournamentSection tournamentId={tournamentId}>
          <div className="space-y-8 animate-in fade-in duration-500">
            <Window
              tabs={tabs.sort((a, b) => {
                return tabsOrder.indexOf(a.id) - tabsOrder.indexOf(b.id);
              })}
            >
              {props.children}
            </Window>
          </div>
        </TournamentSection>
      </MobileMenuProvider>
    </TabsProvider>
  );
}
