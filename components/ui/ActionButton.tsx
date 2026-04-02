import clsx from "clsx";
export type ActionButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export const ActionButton = ({
  onClick,
  children,
  className,
  disabled,
}: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "group relative inline-flex items-center justify-center gap-3",
        "w-full sm:w-auto",
        "px-8 py-4",
        "font-semibold tracking-wide",
        "bg-primary text-black",
        "hover:bg-white hover:text-black",
        "transition-all duration-300 ease-out",
        "transform hover:-translate-y-1 active:translate-y-0",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        "shadow-[0_0_20px_rgba(255,179,0,0.15)] hover:shadow-[0_0_30px_rgba(255,179,0,0.25)]",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        "overflow-hidden",

        className,
      )}
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-[-20deg]" />
      </span>

      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </button>
  );
};
