import { Tv } from "lucide-react";
import { BROADCAST_PLATFORMS } from "@/constants/data";
import { BroadcastPlatform } from "@prisma/client";
import { ConfigDropdown, ConfigInput } from "@/components/ui/components";
import { Card, HandleTournamentChange } from ".";

export const BroadcastSection = ({
  broadcastPlatform,
  broadcastUrl,
  handleChange,
}: {
  broadcastPlatform?: string | null;
  broadcastUrl?: string | null;
  handleChange: HandleTournamentChange;
}) => {
  return (
    <Card icon={Tv} title="Transmissão & Live">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ConfigDropdown
          label="Plataforma"
          name="broadcastPlatform"
          value={broadcastPlatform || BroadcastPlatform.YOUTUBE}
          options={BROADCAST_PLATFORMS}
          onChange={(v) =>
            handleChange(
              "broadcastPlatform",
              v.target.value as BroadcastPlatform,
            )
          }
        />
        <ConfigInput
          label="URL da Transmissão"
          value={broadcastUrl as string}
          onChange={(v) => handleChange("broadcastUrl", v)}
        />
      </div>
    </Card>
  );
};
