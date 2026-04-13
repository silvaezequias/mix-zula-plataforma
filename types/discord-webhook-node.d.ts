declare module "discord-webhook-node" {
  export class Webhook {
    constructor(url: string);
    send(payload: string | MessageBuilder): Promise<void>;
    info(
      title: string,
      field?: string,
      value?: string,
      inline?: boolean,
    ): Promise<void>;
    success(
      title: string,
      field?: string,
      value?: string,
      inline?: boolean,
    ): Promise<void>;
    warning(
      title: string,
      field?: string,
      value?: string,
      inline?: boolean,
    ): Promise<void>;
    error(
      title: string,
      field?: string,
      value?: string,
      inline?: boolean,
    ): Promise<void>;
    setUsername(username: string): void;
    setAvatar(avatarUrl: string): void;
  }

  export class MessageBuilder {
    constructor();
    getJSON(): object;
    setText(text: string): this;
    setAuthor(name?: string, icon?: string, url?: string): this;
    setTitle(title: string): this;
    setURL(url: string): this;
    setThumbnail(url: string): this;
    setImage(url: string): this;
    setTimestamp(date?: number | Date): this;
    setColor(color: string | number): this;
    setDescription(description: string): this;
    addField(name: string, value: string, inline?: boolean): this;
    setFooter(text: string, icon?: string): this;
  }
}
