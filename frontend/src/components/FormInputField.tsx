/**
 * Componente reutilizável para campos de entrada de formulário.
 * Exibe label, input, ícones/prefixos e mensagens de erro de forma consistente.
 */
import type { ChangeEventHandler, ReactNode } from "react";

interface FormInputFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  step?: string;
  placeholder?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  error?: string;
  prefix?: string;
  icon?: ReactNode;
  optionalLabel?: string;
}

export function FormInputField({
  id,
  name,
  label,
  type = "text",
  step,
  placeholder,
  value,
  onChange,
  error,
  prefix,
  icon,
  optionalLabel,
}: FormInputFieldProps) {
  const hasLeading = Boolean(prefix || icon);
  const inputClasses = [
    "w-full rounded-2xl border bg-slate-50 px-4 py-3 text-[0.98rem] transition focus:outline-none focus:ring-2",
    hasLeading ? "pl-11" : "pl-4",
    error
      ? "border-red-700/70 focus:ring-red-700/20"
      : "border-slate-200 focus:border-slate-800 focus:ring-slate-800/20",
  ].join(" ");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[0.92rem] font-semibold text-slate-900">
          {label}
        </label>
        {optionalLabel ? (
          <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[0.72rem] uppercase tracking-[0.08em] text-slate-500">
            {optionalLabel}
          </span>
        ) : null}
      </div>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 w-5 -translate-y-1/2 text-center text-[0.9rem] font-semibold text-slate-500">
            {prefix}
          </span>
        ) : null}
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          name={name}
          type={type}
          step={step}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClasses}
          aria-invalid={error ? "true" : "false"}
        />
      </div>
      {error ? (
        <span className="text-[0.85rem] text-red-700" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
