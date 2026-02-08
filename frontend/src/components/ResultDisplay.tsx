/**
 * Componente principal para exibir os resultados da comparação de custos.
 * Mostra cards de opções, resumo da recomendação e controles de exportação/PDF.
 */
import { useState, useRef } from "react";
import { X } from "lucide-react";
import type { CalculationInput, CalculationResult } from "../types/calculator.types";
import { useExportPDF } from "../hooks/useExportPDF";
import { useResultCalculations } from "../hooks/useResultCalculations";
import { ResultCard } from "./ResultCard";
import { ResultSummary } from "./ResultSummary";
import { ExportSection } from "./ExportSection";

interface ResultDisplayProps {
  result: CalculationResult;
  input?: CalculationInput | null;
  onClose?: () => void;
}

const optionLabels: Record<CalculationResult["recommendation"], string> = {
  cash: "Compra à vista",
  financing: "Compra financiada",
  rental: "Aluguel",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export function ResultDisplay({ result, input, onClose }: ResultDisplayProps) {
  const [isClosing, setIsClosing] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { isExporting, exportReport } = useExportPDF();
  const { cards, maxTotal } = useResultCalculations(result);

  if (!result) {
    return null;
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const handleExportReport = async () => {
    if (!reportRef.current) return;
    await exportReport(reportRef.current);
  };

  const recommendedLabel = optionLabels[result.recommendation];

  return (
    <section className={`result-shell ${isClosing ? "result-shell--closing" : ""}`} aria-live="polite">
      <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 overflow-hidden animate-[fade-up_0.6s_ease_both_0.12s]">
        {onClose && (
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar resultado"
            type="button"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
        {/* Cabeçalho */}
        <div className="p-8 pb-6 sm:p-10 sm:pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold tracking-widest text-gray-900 uppercase bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
              Resultado
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 tracking-tight mb-3 font-display">
            Comparação de custos
          </h2>
          <p className="text-base text-gray-500 leading-relaxed whitespace-nowrap">
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

        {/* Rodapé com ações */}
        <ExportSection
          onExport={handleExportReport}
          onNewSimulation={handleClose}
          isExporting={isExporting}
        />
      </div>

      {/* ── Layout oculto para geração do PDF ── */}
      <div
        ref={reportRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "794px",
          background: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#111827",
        }}
      >
        <div style={{ padding: "40px 44px 32px" }}>
          {/* Header do relatório */}
          <div style={{ marginBottom: "32px", borderBottom: "2px solid #f3f4f6", paddingBottom: "20px" }}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: "top" }}>
                    <h1 style={{ fontSize: "22px", fontWeight: 600, margin: 0, color: "#111827", letterSpacing: "-0.02em" }}>Relatório de Simulação</h1>
                    <p style={{ fontSize: "12px", color: "#9ca3af", margin: "6px 0 0" }}>Comparador Arkar — Comprar, alugar ou financiar?</p>
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "top" }}>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Gerado em</p>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0", fontWeight: 500 }}>
                      {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Dados informados */}
          {input && (
            <div style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7280", margin: "0 0 14px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>Dados informados</h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    {[
                      { label: "Valor do carro", value: formatCurrency(input.carPrice) },
                      { label: "Aluguel mensal", value: formatCurrency(input.monthlyRent) },
                      { label: "Taxa de juros", value: `${input.interestRate}% a.m.` },
                    ].map((item) => (
                      <td key={item.label} style={{ padding: "6px", width: "33.33%" }}>
                        <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "10px 14px" }}>
                          <p style={{ fontSize: "10px", color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>{item.label}</p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827", margin: "4px 0 0" }}>{item.value}</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {[
                      { label: "Prazo do financiamento", value: `${input.financingTerm} meses` },
                      { label: "Entrada", value: input.downPayment ? formatCurrency(input.downPayment) : "Sem entrada" },
                      { label: "Período de comparação", value: `${input.comparisonPeriod ?? input.financingTerm} meses` },
                    ].map((item) => (
                      <td key={item.label} style={{ padding: "6px", width: "33.33%" }}>
                        <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "10px 14px" }}>
                          <p style={{ fontSize: "10px", color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>{item.label}</p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827", margin: "4px 0 0" }}>{item.value}</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Resultados */}
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7280", margin: "0 0 14px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>Comparação de custos</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  {cards.map((card) => {
                    const isBest = card.key === result.recommendation;
                    const barW = maxTotal > 0 ? (card.total / maxTotal) * 100 : 0;
                    return (
                      <td key={card.key} style={{ padding: "6px", width: "33.33%", verticalAlign: "top" }}>
                        <div
                          style={{
                            border: isBest ? "2px solid #c2410c" : "1px solid #e5e7eb",
                            borderRadius: "10px",
                            padding: "16px",
                            background: isBest ? "#fff7ed" : "#ffffff",
                            boxSizing: "border-box",
                          }}
                        >
                          <p style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280", margin: 0 }}>{card.title}</p>
                          <p style={{ fontSize: "20px", fontWeight: 700, color: "#111827", margin: "6px 0" }}>{formatCurrency(card.total)}</p>
                          {card.meta && <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>{card.meta}</p>}
                          <div style={{ height: "4px", background: "#f3f4f6", borderRadius: "999px", marginTop: "10px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${barW}%`, background: isBest ? "#ea580c" : "#d1d5db", borderRadius: "999px" }} />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Recomendação */}
          <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "18px 20px", border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: "14px", color: "#111827", margin: 0 }}>
              A melhor opção é: <strong style={{ color: "#c2410c" }}>{recommendedLabel}</strong>
            </p>
            <div style={{ marginTop: "10px" }}>
              {result.savings.vsFinancing > 0 && (
                <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0" }}>
                  ✓ Economia de <strong style={{ color: "#374151" }}>{formatCurrency(result.savings.vsFinancing)}</strong> em relação ao financiamento
                </p>
              )}
              {result.savings.vsRental > 0 && (
                <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0" }}>
                  ✓ Economia de <strong style={{ color: "#374151" }}>{formatCurrency(result.savings.vsRental)}</strong> em relação ao aluguel
                </p>
              )}
            </div>
          </div>

          {/* Rodapé do relatório */}
          <div style={{ marginTop: "28px", paddingTop: "14px", borderTop: "1px solid #f3f4f6" }}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ fontSize: "10px", color: "#d1d5db", textAlign: "left" }}>Arkar — Simulação educativa. Não constitui aconselhamento financeiro.</td>
                  <td style={{ fontSize: "10px", color: "#d1d5db", textAlign: "right" }}>arkar.com.br</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
