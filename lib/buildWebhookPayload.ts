import { DiscordWebhookConfig } from "@/app/torneios/[id]/(torneio)/(private)/webhooks/WebhookTab/DiscordEmbedPreview";
import { EmbedBuilder } from "@/features/discordWebhook/core";

type GenericListItem = {
  label: string;
  value: string;
};

export function buildWebhookPayload(
  config: DiscordWebhookConfig,
  data: Record<string, string>,
  items?: GenericListItem[],
) {
  const parse = (
    text: string | undefined,
    localContext: Record<string, string> = {},
  ): string => {
    if (!text) return "";
    const combinedData = { ...data, ...localContext };

    return Object.entries(combinedData).reduce((acc, [token, value]) => {
      return acc.replace(new RegExp(token, "g"), value);
    }, text);
  };

  const builders = (config.embeds || []).map((embedData) => {
    const builder = new EmbedBuilder()
      .setTitle(parse(embedData.title))
      .setDescription(parse(embedData.description))
      .setURL(parse(embedData.url) || "")
      .setColor(embedData.color || 0xffb300);

    if (embedData.author?.name) {
      builder.setAuthor({
        name: parse(embedData.author.name),
        icon_url: parse(embedData.author.icon_url),
        url: parse(embedData.author.url),
      });
    }

    if (embedData.footer?.text) {
      builder.setFooter({
        text: parse(embedData.footer.text),
        icon_url: parse(embedData.footer.icon_url),
      });
    }

    if (embedData.thumbnail?.url)
      builder.setThumbnail(parse(embedData.thumbnail.url));
    if (embedData.image?.url) builder.setImage(parse(embedData.image.url));
    if (embedData.timestamp) builder.setTimestamp();

    embedData.fields?.forEach((field) => {
      if (field.name === "{loop_items}") {
        items?.forEach((item) => {
          const itemContext = {
            "{item_value}": item.value,
          };

          builder.addField(
            parse(item.label),
            parse(field.value, itemContext),
            field.inline,
          );
        });
      } else {
        builder.addField(parse(field.name), parse(field.value), field.inline);
      }
    });

    return builder;
  });

  return {
    content: parse(config.content),
    username: config.username,
    avatarURL: config.avatar_url,
    embeds: builders,
  };
}
