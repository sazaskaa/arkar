/**
 * Componente para cabeçalhos de seções em formulários.
 * Exibe um ícone e título de forma padronizada.
 */
import type { ReactNode } from "react";

interface FormSectionHeaderProps {
  title: string;
  icon: ReactNode;
}

export function FormSectionHeader({ title, icon }: FormSectionHeaderProps) {
  return (
    <h3 className="inline-flex items-center gap-2.5 text-base font-semibold text-slate-900">
      <span
        className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500"
        aria-hidden="true"
      >
        {icon}
      </span>
      {title}
    </h3>
  );
}
