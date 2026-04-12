import { Globe, Radio, Tv } from "lucide-react";
import { BROADCAST_PLATFORMS } from "@/constants/data";
import {
  ConfigDropdown,
  ConfigField,
} from "../../../../components/ui/components";
import { BroadcastPlatform } from "@prisma/client";

export const BroadcastSection = ({
  broadcastPlatform,
  broadcastUrl,
  handleChange,
}: {
  broadcastPlatform?: string | null;
  broadcastUrl?: string | null;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}) => {
  return (
    <section className="bg-[#111] border border-zinc-800 p-8 shadow-2xl relative">
      <h3 className="text-lg font-black mb-8 flex items-center gap-3 italic text-zinc-400 uppercase">
        <Tv size={20} className="text-primary" /> Transmissão & Live
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ConfigDropdown
          label="Plataforma"
          name="broadcastPlatform"
          value={broadcastPlatform || BroadcastPlatform.NONE}
          options={BROADCAST_PLATFORMS}
          onChange={handleChange}
          icon={<Radio size={14} className="text-primary" />}
        />
        <ConfigField
          label="URL da Transmissão"
          name="broadcastUrl"
          value={broadcastUrl as string}
          onChange={handleChange}
          placeholder="https://youtube.com/live...."
          icon={<Globe size={14} className="text-primary" />}
        />
      </div>
    </section>
  );
};
