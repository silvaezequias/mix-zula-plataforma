import { useState } from "react";

export const Text = ({ content }: { content: React.ReactNode }) => {
  return <span>{content}</span>;
};

export const Spoiler = ({ content }: { content: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const classes =
    (isOpen ? "text-white" : "text-zinc-900 cursor-pointer") +
    " px-1 py-0.5 select-none bg-zinc-900";

  return (
    <span onClick={() => setIsOpen((prev) => !prev)} className={classes}>
      {content}
    </span>
  );
};

export const Italic = ({ content }: { content: React.ReactNode }) => {
  return <span className="italic">{content}</span>;
};

export const Strong = ({ content }: { content: React.ReactNode }) => {
  return <span className="font-bold">{content}</span>;
};

export const InlineCode = ({ content }: { content: React.ReactNode }) => {
  return <span className="bg-zinc-800 text-white font-mono">{content}</span>;
};

export const Underline = ({ content }: { content: React.ReactNode }) => {
  return <span className="underline">{content}</span>;
};

export const Link = ({
  content,
  url,
}: {
  content: React.ReactNode;
  url: string;
}) => {
  return (
    <a href={url} target="_blank" className="text-blue-500 hover:underline">
      {content}
    </a>
  );
};

export const BlockQuote = ({ content }: { content: React.ReactNode }) => {
  return <span className="border-l-2">{content}</span>;
};

export const Heading = ({
  content,
  level,
}: {
  content: React.ReactNode;
  level: number;
}) => {
  const classes = `font-bold ${level === 1 ? "text-2xl py-4" : level === 2 ? "text-xl py-3" : "text-lg py-2"}`;

  return <div className={classes}>{content}</div>;
};

export const Codeblock = ({
  content,
}: {
  content: React.ReactNode;
  lang: "js";
}) => {
  return <span>{content}</span>;
};

export const Strike = ({ content }: { content: React.ReactNode }) => {
  return <span>{content}</span>;
};

export const Mention = ({ content }: { content: React.ReactNode }) => {
  return (
    <span className="bg-indigo-400/20 px-1 py-0.5 rounded text-indigo-300 font-semibold">
      @{content}
    </span>
  );
};
