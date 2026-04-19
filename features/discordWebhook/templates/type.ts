import { DiscordWebhookConfig } from "@/app/torneios/[id]/(torneio)/(private)/webhooks/WebhookTab/DiscordEmbedPreview";

export type WebhookBase = {
  name: string;
  description: string;
  config: DiscordWebhookConfig;
};
