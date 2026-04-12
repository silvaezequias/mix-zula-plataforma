import { ChevronDown, InfinityIcon } from "lucide-react";
import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export const SectionHeader = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-3 text-zinc-500 border-b border-zinc-900 pb-4 uppercase italic">
    {icon}
    <h3 className="text-sm font-black italic tracking-tighter">{title}</h3>
  </div>
);

export const ConfigInput = ({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-bold text-zinc-500 uppercase italic">
        {label}
      </label>
      <input
        type={type}
        className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white italic outline-none focus:border-primary text-sm font-bold"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

type PresetButtonProps = {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: ReactNode;
};

export const PresetButton = ({
  active,
  onClick,
  label,
  icon,
}: PresetButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 px-5 py-3 border transition-all ${active ? "bg-primary border-primary text-black shadow-lg scale-105" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600"}`}
  >
    {icon}
    <span className="text-[10px] font-black italic uppercase">{label}</span>
  </button>
);

type BaseProps = {
  label: string;
  icon?: ReactNode;
};

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    textarea?: false;
  };

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    textarea: true;
  };

type ConfigFieldProps = InputProps | TextareaProps;

export const ConfigField = ({
  label,
  textarea,
  icon,
  ...props
}: ConfigFieldProps) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2 italic">
      {icon} {label}
    </label>
    {textarea ? (
      <textarea
        {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 text-sm font-black italic outline-none focus:border-primary transition-all resize-none"
      />
    ) : (
      <input
        {...(props as InputHTMLAttributes<HTMLInputElement>)}
        className="w-full bg-zinc-900 border border-zinc-800 p-4 text-sm font-black italic text-white outline-none focus:border-primary transition-all"
      />
    )}
  </div>
);

type ConfigDropdownProps<T extends string = string> = {
  label: string;
  name: string;
  value: T;
  options: readonly T[];
  labels?: readonly T[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  icon?: ReactNode;
};

export const ConfigDropdown = ({
  label,
  name,
  value,
  options,
  labels,
  onChange,
  icon,
}: ConfigDropdownProps) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-zinc-600 uppercase flex items-center gap-1 italic">
      {icon} {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-zinc-900 border border-zinc-800 p-3.5 text-xs font-black italic text-white outline-none appearance-none focus:border-primary cursor-pointer"
      >
        {options.map((opt: string, index) => (
          <option key={opt} value={opt}>
            {labels?.[index].toUpperCase() || opt.toUpperCase()}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
        size={14}
      />
    </div>
  </div>
);

type ConfigNumberInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon?: ReactNode;
};

export const ConfigNumberInput = ({
  label,
  value,
  onChange,
  icon,
}: ConfigNumberInputProps) => {
  const isInfinite = value === 0;
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800 group hover:border-primary/20 transition-all">
      <div className="flex items-center gap-3">
        <span className="text-zinc-600">{icon}</span>
        <label className="text-[10px] font-black text-zinc-500 uppercase italic leading-none">
          {label}
        </label>
      </div>
      <div className="flex items-center gap-4">
        {isInfinite ? (
          <span className="text-primary font-black flex items-center gap-2 text-xs italic">
            <InfinityIcon size={14} /> INFINITO
          </span>
        ) : (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            className="w-16 bg-zinc-900 border border-zinc-800 p-1 text-center text-xs font-black text-white outline-none focus:border-primary"
          />
        )}
        <button
          type="button"
          onClick={() => onChange(isInfinite ? 10 : 0)}
          className={`px-3 py-1 text-[8px] font-black uppercase border transition-all ${isInfinite ? "bg-primary border-primary text-black" : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-white"}`}
        >
          {isInfinite ? "LIMITAR" : "INFINITO"}
        </button>
      </div>
    </div>
  );
};

type ConfigSwitchProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

export const ConfigSwitch = ({
  label,
  checked,
  onChange,
}: ConfigSwitchProps) => (
  <div className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/50">
    <p className="text-[10px] font-black italic uppercase text-zinc-500">
      {label}
    </p>
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-10 items-center transition-all focus:outline-none border ${checked ? "bg-primary border-primary" : "bg-zinc-950 border-zinc-800"}`}
    >
      <div
        className={`inline-block h-3 w-3 transform transition-transform ${checked ? "translate-x-6 bg-black" : "translate-x-1 bg-zinc-700"}`}
      ></div>
    </button>
  </div>
);
