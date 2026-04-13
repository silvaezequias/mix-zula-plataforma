import fetch from "node-fetch";

type EmbedField = {
  name: string;
  value: string;
  inline?: boolean;
};

type EmbedAuthor = {
  name: string;
  url?: string;
  icon_url?: string;
};

type EmbedFooter = {
  text: string;
  icon_url?: string;
};

type EmbedImage = {
  url: string;
};

export type DiscordEmbed = {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  author?: EmbedAuthor;
  footer?: EmbedFooter;
  thumbnail?: EmbedImage;
  image?: EmbedImage;
  fields?: EmbedField[];
  timestamp?: string;
  text?: string;
  type: string;
};

export class EmbedBuilder {
  public embed: DiscordEmbed = {
    type: "rich",
    fields: [],
  };

  setText(text: string) {
    this.embed.text = text;
    return this;
  }

  setTitle(title: string) {
    this.embed.title = title;
    return this;
  }

  setDescription(description: string) {
    this.embed.description = description;
    return this;
  }

  setURL(url: string) {
    this.embed.url = url;
    return this;
  }

  setColor(color: number) {
    this.embed.color = color;
    return this;
  }

  setAuthor(author: EmbedAuthor) {
    this.embed.author = author;
    return this;
  }

  setFooter(footer: EmbedFooter) {
    this.embed.footer = footer;
    return this;
  }

  setThumbnail(url: string) {
    this.embed.thumbnail = { url };
    return this;
  }

  setImage(url: string) {
    this.embed.image = { url };
    return this;
  }

  addField(name: string, value: string, inline = false) {
    if (!this.embed.fields?.length) this.embed.fields = [];
    this.embed.fields.push({ name, value, inline });
    return this;
  }

  setTimestamp(date: Date = new Date()) {
    this.embed.timestamp = date.toISOString();
    return this;
  }

  toJSON() {
    return this.embed;
  }
}

export class WebhookClient {
  constructor(private url: string) {}

  async send(options: {
    content?: string;
    username?: string;
    avatarURL?: string;
    embeds?: EmbedBuilder[];
  }) {
    const body = {
      content: options.content,
      username: options.username,
      avatar_url: options.avatarURL,
      embeds: options.embeds?.map((e) => e.toJSON()),
    };

    await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
}
