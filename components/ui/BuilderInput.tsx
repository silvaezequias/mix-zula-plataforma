import { ReactNode } from "react";

interface BuilderInputProps {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  icon?: ReactNode;
  type?: string;
}

export const BuilderInput = ({
  label,
  value,
  onChange,
  icon,
  type = "text",
}: BuilderInputProps) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-zinc-500 uppercase italic flex items-center gap-2">
      {icon} {label}
    </label>
    <input
      type={type}
      className="w-full bg-black border border-zinc-800 p-3 text-xs font-black italic text-white outline-none focus:border-[#FFB300] transition-all"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
