import { DiscordWebhookConfig } from "@/app/torneios/[id]/(torneio)/tabs/WebhookTab/DiscordEmbedPreview";

export type WebhookBase = {
  name: string;
  description: string;
  config: DiscordWebhookConfig;
};
