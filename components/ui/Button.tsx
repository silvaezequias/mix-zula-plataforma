import React from "react";

type Variant = "default" | "outline" | "ghost";
type Intent = "default" | "success" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  intent?: Intent;
}

export function Button({
  children,
  variant = "default",
  intent = "default",
  className,
  disabled,
  onClick,
  ...rest
}: ButtonProps) {
  const base =
    "font-bold text-xs px-3 py-2 rounded transition-colors duration-200";

  const variants: Record<Variant, string> = {
    default: "border",
    outline: "border bg-transparent",
    ghost: "bg-transparent border-transparent",
  };

  const intents: Record<Intent, string> = {
    default: "text-white bg-[#111] border-[#111] hover:bg-[#242424]",
    success:
      "text-white bg-green-600/50 border-green-600/50 hover:bg-green-500/50",
    danger: "text-white bg-red-600/50 border-red-600/50 hover:bg-red-500/50",
  };

  const ghostIntents: Record<Intent, string> = {
    default: "text-white hover:bg-[#111]",
    success: "text-green-600 hover:bg-green-600/10",
    danger: "text-red-600 hover:bg-red-600/20",
  };

  const outlineIntents: Record<Intent, string> = {
    default: "text-white border-[#111] hover:bg-[#111]",
    success: "text-green-600 border-green-600 hover:bg-green-50",
    danger: "text-red-600 border-red-600 hover:bg-red-50",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";

  function getIntentStyle() {
    if (variant === "ghost") return ghostIntents[intent];
    if (variant === "outline") return outlineIntents[intent];
    return intents[intent];
  }

  return (
    <button
      {...rest}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`${base} ${variants[variant]} ${getIntentStyle()} ${
        disabled ? disabledStyles : "cursor-pointer"
      } ${className || ""}`}
    >
      {children}
    </button>
  );
}
