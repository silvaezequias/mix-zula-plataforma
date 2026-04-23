import parse from "discord-markdown-parser";
import {
  BlockQuote,
  Codeblock,
  Heading,
  InlineCode,
  Italic,
  Link,
  Mention,
  Spoiler,
  Strike,
  Strong,
  Text,
  Underline,
} from "./content";

type Token =
  | { type: "br" }
  | { type: "everyone" }
  | { type: "twemoji"; name: string }
  | { type: "text"; content: string }
  | { type: "codeBlock"; content: string; lang: "js" }
  | { type: "link" | "url"; target: string; content: Token[] }
  | { type: "heading"; level: 1 | 2 | 3; content: Token[] }
  | {
      type:
        | "em"
        | "strong"
        | "strikethrough"
        | "spoiler"
        | "underline"
        | "blockQuote"
        | "inlineCode";
      content: Token[];
    };

export default function markdownParser(content: string) {
  const tokens = parse(content, "extended") as Token[];
  const markdownAsComponent = tokens.map((token, i) => handleContent(token, i));

  return markdownAsComponent;
}

function handleContent(token: Token, index: number): React.ReactNode {
  if (token.type === "br") {
    return <br />;
  }

  if (token.type === "url") {
    return token.target;
  }

  if (token.type === "everyone") {
    return <Mention key={index} content="everyone" />;
  }

  if (token.type === "twemoji") {
    return token.name;
  }

  if (token.type === "text") {
    return <Text key={index} content={token.content} />;
  }

  if (token.type === "codeBlock") {
    return <Codeblock key={index} content={token.content} lang={token.lang} />;
  }

  if (token.type === "link") {
    return (
      <Link
        key={index}
        content={token.content.map((t, i) => handleContent(t, -(i * index)))}
        url={token.target}
      />
    );
  }

  if (token.type === "heading") {
    return (
      <Heading
        key={index}
        level={token.level}
        content={token.content.map((t, i) => handleContent(t, -(i * index)))}
      />
    );
  }

  console.log(token);

  const parsedContent =
    token.content?.map?.((t, i) => handleContent(t, -(i * index))) ||
    token.content;

  const typeMap = {
    em: (props: { content: React.ReactNode }) => (
      <Italic key={index} {...props} />
    ),
    strong: (props: { content: React.ReactNode }) => (
      <Strong key={index} {...props} />
    ),
    spoiler: (props: { content: React.ReactNode }) => (
      <Spoiler key={index} {...props} />
    ),
    underline: (props: { content: React.ReactNode }) => (
      <Underline key={index} {...props} />
    ),
    blockQuote: (props: { content: React.ReactNode }) => (
      <BlockQuote key={index} {...props} />
    ),
    inlineCode: (props: { content: React.ReactNode }) => (
      <InlineCode key={index} {...props} />
    ),

    strikethrough: (props: { content: React.ReactNode }) => (
      <Strike key={index} {...props} />
    ),
  };

  return typeMap[token.type]({ content: parsedContent });
}
