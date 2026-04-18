import React, { useMemo, useCallback } from "react";
import { Webhook } from "lucide-react";
import Image from "next/image";
import { PREVIEW_DATA } from "./contants";

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  timestamp?: boolean | string;
  footer?: {
    text: string;
    icon_url?: string;
  };
  thumbnail?: {
    url: string;
  };
  image?: {
    url: string;
  };
  author?: {
    name: string;
    icon_url?: string;
    url?: string;
  };
  fields?: DiscordEmbedField[];
}

export interface DiscordWebhookConfig {
  content?: string;
  username?: string;
  avatar_url?: string;
  embeds: DiscordEmbed[];
}

export const DiscordEmbedPreview = ({
  config,
}: {
  config: DiscordWebhookConfig;
}) => {
  const embed = config.embeds[0] || {};

  const processTokens = useCallback((text: string | undefined) => {
    if (!text) return "";
    return Object.entries(PREVIEW_DATA).reduce((acc, [token, value]) => {
      return acc.replace(new RegExp(token, "g"), value);
    }, String(text));
  }, []);

  const finalFields = useMemo(() => {
    if (!embed.fields) return [];
    return embed.fields.flatMap((f) => {
      if (f.name === "{loop_teams}") {
        return [
          {
            name: "SQUAD ALPHA",
            value: processTokens(f.value),
            inline: f.inline,
          },
          {
            name: "SQUAD BRAVO",
            value: processTokens(f.value),
            inline: f.inline,
          },
        ];
      }
      return {
        name: processTokens(f.name),
        value: processTokens(f.value),
        inline: f.inline,
      };
    });
  }, [embed.fields, processTokens]);

  return (
    <div className="bg-[#313338] p-4 font-sans rounded-sm text-[15px] shadow-lg border border-white/5 text-left normal-case tracking-normal">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#5865f2] shrink-0 flex items-center justify-center overflow-hidden">
          {config.avatar_url ? (
            <Image
              src={config.avatar_url}
              alt="avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <Webhook size={20} className="text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-bold text-white hover:underline cursor-pointer">
              {config.username || "Arena Bot"}
            </span>
            <span className="bg-[#5865f2] text-white text-[10px] px-1 rounded-[3px] font-medium h-3.75 flex items-center">
              APP
            </span>
            <span className="text-[#949ba4] text-xs ml-1 font-normal">
              Hoje às 19:10
            </span>
          </div>

          <div className="text-[#dbdee1] mb-2 wrap-break-word">
            {processTokens(config.content)}
          </div>

          <div
            className="max-w-108 border-l-4 rounded-lg bg-[#2b2d31] flex flex-col md:flex-row overflow-hidden shadow-md"
            style={{
              borderColor: embed.color
                ? `#${embed.color.toString(16).padStart(6, "0")}`
                : "#1e1f22",
            }}
          >
            <div className="p-3 pr-4 flex-1">
              {embed.author?.name && (
                <div className="flex items-center gap-2 mb-2">
                  {embed.author.icon_url && (
                    <Image
                      src={embed.author.icon_url}
                      className="w-6 h-6 rounded-full"
                      width={24}
                      height={24}
                      alt=""
                    />
                  )}
                  <span className="text-sm font-semibold text-white uppercase">
                    {processTokens(embed.author.name)}
                  </span>
                </div>
              )}

              {embed.title && (
                <div
                  className={`text-base font-bold text-white mb-2 ${embed.url ? "text-[#00a8fc] hover:underline cursor-pointer" : ""}`}
                >
                  {processTokens(embed.title)}
                </div>
              )}

              {embed.description && (
                <div className="text-sm text-[#dbdee1] whitespace-pre-wrap mb-3">
                  {processTokens(embed.description)}
                </div>
              )}

              <div className="grid grid-cols-12 gap-y-2 gap-x-4 mb-3">
                {finalFields.map((f, i) => (
                  <div
                    key={i}
                    className={f.inline ? "col-span-4" : "col-span-12"}
                  >
                    <div className="text-sm font-bold text-white mb-0.5">
                      {f.name}
                    </div>
                    <div className="text-sm text-[#dbdee1] whitespace-pre-wrap">
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              {(embed.footer?.text || embed.timestamp) && (
                <div className="flex items-center gap-2 mt-2 border-t border-white/5 pt-2">
                  {embed.footer?.icon_url && (
                    <Image
                      src={embed.footer.icon_url}
                      className="w-5 h-5 rounded-full"
                      width={20}
                      height={20}
                      alt=""
                    />
                  )}
                  <span className="text-xs text-[#949ba4] font-medium">
                    {processTokens(embed.footer?.text)}{" "}
                    {embed.timestamp && ` • Hoje às 19:10`}
                  </span>
                </div>
              )}
            </div>

            {embed.thumbnail?.url && (
              <div className="p-3 pl-0 shrink-0">
                <Image
                  src={embed.thumbnail.url}
                  className="w-20 h-20 rounded-lg object-cover"
                  width={80}
                  height={80}
                  alt=""
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
