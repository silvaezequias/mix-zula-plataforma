"use server";

import { Page } from "@/components/Page";
import { TabsProvider } from "@/providers/TabContext";
import { SelectedParticipantProvider } from "@/providers/SelectedParticipantContext";
import { TournamentHeader } from "./TournamentHeader";
import { getTournamentOverviewAction } from "@/features/tournament/action/feed/getTournamentOverviewAction";
import { redirect } from "next/navigation";

type LayoutProps = {
  children: React.ReactNode;
  tournamentId: string;
};

export async function TournamentSection({
  children,
  tournamentId,
}: LayoutProps) {
  const { data: tournament } = await getTournamentOverviewAction(tournamentId);

  if (!tournament) {
    return redirect(`/torneios/nao-encontrado?id=${tournamentId}`);
  }

  return (
    <Page>
      <TabsProvider>
        <SelectedParticipantProvider>
          <div className="max-w-480 mx-auto h-screen max-h-screen flex flex-col lg:flex-row">
            <main className="flex-1 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_left,#111_0%,#050505_100%)] order-2 lg:order-1">
              <TournamentHeader />

              <div className="p-6">
                <div className="inline-block bg-primary text-black px-4 py-1 text-[10px] font-black mb-4 skew-x-[-15deg]">
                  <span className="inline-block skew-x-15">
                    INFORMAÇÕES DO TORNEIO
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter leading-none mb-6 uppercase">
                  {tournament.title}
                </h1>

                {children}
              </div>
            </main>

            {/* <Sidebar /> */}
          </div>
        </SelectedParticipantProvider>
      </TabsProvider>
    </Page>
  );
}
