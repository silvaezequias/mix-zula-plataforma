"use client";

import { Terminal } from "lucide-react";
import { DiscordEmbedPreview } from "./DiscordEmbedPreview";
import { useState, useTransition } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { useCountdown } from "@/hooks/useCooldown";
import { dispatchWebhook } from "@/features/discordWebhook/action";
import { toast } from "react-toastify";
import {
  WebhookId,
  webhookTemplates,
} from "@/features/discordWebhook/templates";

export const WebhookTab = ({ tournamentId }: { tournamentId: string }) => {
  const { active, reset, start, time } = useCountdown(3);
  const [isPending, startTransition] = useTransition();

  const [selectedId, setSelectedId] = useState<WebhookId>("invite");
  const selectedWebhook = webhookTemplates[selectedId];

  const handleDispatch = async () => {
    if (!active) return start();
    reset();

    startTransition(async () => {
      const result = await dispatchWebhook(tournamentId, selectedId);
      if (!result.success) toast.error(result.error);
    });
  };

  return (
    <main className="flex-1 overflow-auto p-6 lg:p-12 custom-scrollbar">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-[#111] border border-zinc-800">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h4 className="text-lg font-black italic text-indigo-400 flex items-center gap-2">
                <Terminal size={20} /> PREVIEW DA MENSAGEM
              </h4>
            </div>
            <div className="p-8 bg-zinc-950">
              <DiscordEmbedPreview config={selectedWebhook.config} />
            </div>

            <div className="p-6 border-t border-zinc-900 flex justify-between items-center bg-zinc-900/10">
              <p className="text-[9px] text-zinc-500 max-w-xs italic">
                Os tokens serão substituídos por dados reais no momento do
                disparo.
              </p>

              <ActionButton
                className="w-full uppercase"
                disabled={isPending}
                onClick={handleDispatch}
                intent={active ? "success" : "default"}
              >
                {isPending
                  ? "Processando..."
                  : active
                    ? `Confirmar disparo em (${time}s)`
                    : "Disparar"}
              </ActionButton>
            </div>
          </section>
        </div>
        <aside className="lg:col-span-4 space-y-6">
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-zinc-500 pl-3 border-l-2 border-indigo-500">
              MENSAGENS
            </h3>
            {Object.entries(webhookTemplates).map(
              ([id, { name, description }]) => (
                <button
                  key={id}
                  onClick={() => setSelectedId(id as WebhookId)}
                  className={`w-full text-left p-5 border-2 transition-all group
                        ${selectedId === id ? "border-indigo-500 bg-[#111]" : "border-zinc-800 bg-zinc-900/40 opacity-60 hover:opacity-100"}`}
                >
                  <h4 className="font-black italic text-sm">{name}</h4>
                  <p className="text-[8px] mt-1 text-zinc-500">{description}</p>
                </button>
              ),
            )}
          </div>
        </aside>
      </div>
    </main>
  );
};
