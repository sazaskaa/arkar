/**
 * Componente para os controles de ação na tela de resultados.
 * Inclui botões para exportar relatório em PDF e iniciar nova simulação.
 */
import { Download, Loader2, RotateCcw } from "lucide-react";

interface ExportSectionProps {
  onExport: () => void;
  onNewSimulation: () => void;
  isExporting: boolean;
}

export function ExportSection({ onExport, onNewSimulation, isExporting }: ExportSectionProps) {
  return (
    <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-between items-center dark:bg-slate-900/80 dark:border-slate-800">
      <button
        type="button"
        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-100"
        onClick={onExport}
        disabled={isExporting}
      >
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {isExporting ? "Gerando PDF…" : "Exportar relatório"}
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-700 dark:focus:ring-offset-0"
        onClick={onNewSimulation}
      >
        <RotateCcw className="w-4 h-4 text-gray-500 dark:text-slate-400" />
        Nova simulação
      </button>
    </div>
  );
}
