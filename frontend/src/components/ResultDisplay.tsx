/**
 * Componente principal para exibir os resultados da comparação de custos.
 * Mostra cards de opções, resumo da recomendação e controles de exportação/PDF.
 */
import { useRef } from "react";
import { X } from "lucide-react";
import type { CalculationInput, CalculationResult } from "../types/calculator.types";
import { useExportPDF } from "../hooks/useExportPDF";
import { useResultCalculations } from "../hooks/useResultCalculations";
import { ResultCard } from "./ResultCard";
import { ResultSummary } from "./ResultSummary";
import { ExportSection } from "./ExportSection";
import { PDFReportTemplate } from "./PDFReportTemplate";

interface ResultDisplayProps {
  result: CalculationResult;
  input?: CalculationInput | null;
  onClose?: () => void;
}

export function ResultDisplay({ result, input, onClose }: ResultDisplayProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const { isExporting, exportError, clearExportError, exportReport } = useExportPDF();
  const { cards, maxTotal } = useResultCalculations(result);

  if (!result) {
    return null;
  }

  const handleExportReport = async () => {
    clearExportError();
    if (!reportRef.current) return;
    await exportReport(reportRef.current);
  };

  return (
    <section className="result-shell" aria-live="polite">
      <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 overflow-hidden animate-[fade-up_0.6s_ease_both_0.12s] dark:bg-slate-900 dark:border-slate-800 dark:shadow-[0_20px_60px_rgba(2,6,23,0.55)]">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors dark:text-slate-500 dark:hover:text-slate-200"
            aria-label="Fechar resultado"
            type="button"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
        {/* Cabeçalho */}
        <div className="p-8 pb-6 sm:p-10 sm:pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold tracking-widest text-gray-900 uppercase bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700">
              Resultado
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 tracking-tight mb-3 font-display dark:text-slate-100">
            Comparação de custos
          </h2>
          <p className="text-base text-gray-500 leading-relaxed whitespace-nowrap dark:text-slate-400">
            Veja o total estimado para cada opção e a recomendação com base no menor custo financeiro ao final do período
          </p>
        </div>

        {/* Grid de opções */}
        <div className="px-8 sm:px-10 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card) => (
              <ResultCard
                key={card.key}
                card={card}
                isBest={card.key === result.recommendation}
                maxTotal={maxTotal}
              />
            ))}
          </div>
        </div>

        {/* Resumo da análise */}
        <div className="px-8 sm:px-10 py-8">
          <ResultSummary result={result} />
        </div>

        {/* Erro de exportação */}
        {exportError && (
          <div className="mx-8 sm:mx-10 mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-200" role="alert">
            {exportError}
          </div>
        )}

        {/* Rodapé com ações */}
        <ExportSection
          onExport={handleExportReport}
          onNewSimulation={onClose ?? (() => {})}
          isExporting={isExporting}
        />
      </div>

      {/* Template oculto para geração do PDF */}
      <PDFReportTemplate
        ref={reportRef}
        result={result}
        input={input ?? null}
        cards={cards}
        maxTotal={maxTotal}
      />
    </section>
  );
}
