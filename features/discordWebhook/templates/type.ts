import { DiscordWebhookConfig } from "@/app/torneios/[id]/(torneio)/webhooks/WebhookTab/DiscordEmbedPreview";

export type WebhookBase = {
  name: string;
  description: string;
  config: DiscordWebhookConfig;
};
