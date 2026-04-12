import { cn } from "@/lib/utils"; // se tiver um helper de classnames

type CardPlayerProps = {
  name: string;
  nickname: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const CardPlayer = ({
  name,
  nickname,
  children,
  className,
  onClick,
}: CardPlayerProps) => {
  const initial = name?.charAt(0) ?? "?";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "bg-zinc-900/50 border border-zinc-800 p-4 gap-5 grid grid-cols-2 place-items-center group transition-all duration-200",
        "hover:border-primary/50 hover:bg-zinc-900/70",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <div className="flex items-center gap-4 place-self-start self-center">
        <div className="hidden md:flex w-10 h-10 bg-zinc-800 items-center justify-center uppercase text-primary font-black border border-zinc-700 italic rounded-md">
          {initial}
        </div>

        <div className="leading-tight">
          <p className="text-sm font-black italic text-white uppercase tracking-tight">
            {nickname}
          </p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight italic">
            @{name}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
};
