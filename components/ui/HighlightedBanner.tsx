import { ChevronRight } from "lucide-react";

type HighlightedBannerProps = {
  cta?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

export const HightlightedBanner = ({
  onClick,
  children,
  cta,
}: HighlightedBannerProps) => {
  return (
    <div
      onClick={onClick}
      className="relative h-10 bg-primary flex items-center overflow-hidden cursor-pointer group z-100 border-b border-black/10 shadow-[0_4px_15px_rgba(255,179,0,0.3)]"
    >
      <div className="animate-marquee">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 text-black font-black text-[10px] uppercase"
          >
            {children}
          </div>
        ))}
      </div>
      {cta && (
        <div className="absolute right-0 top-0 bottom-0 bg-primary pl-6 pr-4 flex items-center shadow-[-20px_0_20px_rgba(255,179,0,1)]">
          <span className="text-[10px] font-black text-black uppercase mr-2 hidden md:inline-block">
            {cta}
          </span>
          <ChevronRight
            size={14}
            className="text-black group-hover:translate-x-1 transition-transform"
          />
        </div>
      )}
    </div>
  );
};
