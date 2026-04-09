import clsx from "clsx";

export type ActionButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "solid" | "ghost" | "outline";
  intent?: "default" | "danger" | "success";
};

export const ActionButton = ({
  onClick,
  children,
  className,
  disabled,
  variant = "solid",
  intent = "default",
}: ActionButtonProps) => {
  const baseStyles =
    "group relative cursor-pointer inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 tracking-wide transition-all duration-300 ease-out transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 overflow-hidden";

  const intentStyles = {
    default: {
      solid: "bg-primary text-black hover:bg-white",
      ghost: "text-zinc-300 hover:bg-zinc-800",
      outline: "border-2 border-zinc-700 text-zinc-300 hover:border-white",
      ring: "focus:ring-primary/50",
      shadow:
        "shadow-[0_0_20px_rgba(255,179,0,0.15)] hover:shadow-[0_0_30px_rgba(255,179,0,0.25)]",
    },
    danger: {
      solid: "bg-red-600 text-white hover:bg-red-500",
      ghost: "text-red-400 hover:bg-red-500/10",
      outline: "border-2 border-red-500 text-red-400 hover:bg-red-500/10",
      ring: "focus:ring-red-500/50",
      shadow:
        "shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]",
    },
    success: {
      solid: "bg-green-600 text-white hover:bg-green-500",
      ghost: "text-green-400 hover:bg-green-500/10",
      outline: "border-2 border-green-500 text-green-400 hover:bg-green-500/10",
      ring: "focus:ring-green-500/50",
      shadow:
        "shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]",
    },
  };

  const styles = intentStyles[intent];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        styles[variant],
        styles.ring,
        variant === "solid" && styles.shadow,
        className,
      )}
    >
      {/* brilho só em solid */}
      {variant === "solid" && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-[-20deg]" />
        </span>
      )}

      <span className="relative z-10 flex items-center gap-3 font-black">
        {children}
      </span>
    </button>
  );
};
