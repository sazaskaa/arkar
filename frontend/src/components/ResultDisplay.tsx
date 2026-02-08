import { useState, useRef } from "react";
import { Trophy, TrendingUp, Check, Download, RotateCcw, X, Loader2 } from "lucide-react";
import type { CalculationInput, CalculationResult } from "../types/calculator.types";

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
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!result) {
    return null;
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const recommendedLabel = optionLabels[result.recommendation];

  const handleExportReport = async () => {
    if (!reportRef.current || isExporting) return;
    setIsExporting(true);
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const element = reportRef.current;
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "794px"; // A4 width in pixels at 96dpi
    iframe.style.height = "1123px"; // A4 height in pixels at 96dpi
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    if (!doc) {
      document.body.removeChild(iframe);
      setIsExporting(false);
      return;
    }

    doc.open();
    doc.write("<!doctype html><html><head><style>body{margin:0;background:#fff;font-family:Arial,Helvetica,sans-serif;}</style></head><body></body></html>");
    doc.close();

    const clone = element.cloneNode(true) as HTMLDivElement;
    clone.style.position = "static";
    clone.style.left = "0";
    clone.style.top = "0";
    clone.style.width = "794px";
    clone.style.minHeight = "1123px";
    clone.style.background = "#ffffff";
    clone.style.display = "block";
    doc.body.appendChild(clone);

    // Aguarda fontes e renderização
    if (doc.fonts?.ready) {
      await doc.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        width: clone.scrollWidth,
        height: clone.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      let imgWidth = pageWidth - margin * 2;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pageHeight - margin * 2) {
        imgHeight = pageHeight - margin * 2;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight, undefined, "FAST");
      pdf.save("relatorio-arkar.pdf");
    } catch (err) {
      console.error("Erro ao exportar PDF:", err);
    } finally {
      document.body.removeChild(iframe);
      setIsExporting(false);
    }
  };

  const cards = [
    {
      key: "cash" as const,
      title: "Compra à vista",
      total: result.cash.total,
      meta: null,
    },
    {
      key: "financing" as const,
      title: "Compra financiada",
      total: result.financing.total,
      meta: `Parcela: ${formatCurrency(result.financing.monthlyPayment)}/mês`,
    },
    {
      key: "rental" as const,
      title: "Aluguel",
      total: result.rental.total,
      meta: "Total no período",
    },
  ];

  const maxTotal = Math.max(...cards.map((c) => c.total));

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
            {cards.map((card) => {
              const isBest = card.key === result.recommendation;
              const barWidth =
                maxTotal > 0 ? (card.total / maxTotal) * 100 : 0;
              const ariaLabel = isBest
                ? `${card.title} (melhor opção)`
                : card.title;

              return (
                <article
                  key={card.key}
                  className={
                    isBest
                      ? "relative group rounded-xl border-2 border-orange-600/20 bg-orange-50/20 p-5 transition-all hover:border-orange-600/30"
                      : "relative rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 transition-all"
                  }
                  aria-label={ariaLabel}
                >
                  {isBest && (
                    <div className="absolute -top-3 left-4">
                      <span className="bg-orange-700 text-white text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide shadow-sm inline-flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Melhor opção
                      </span>
                    </div>
                  )}

                  <div className="mt-2 space-y-4">
                    <div>
                      <h3
                        className={`text-sm font-medium ${isBest ? "text-gray-900" : "text-gray-600"}`}
                      >
                        {card.title}
                      </h3>
                      <p
                        className={`mt-2 text-2xl tracking-tight text-gray-900 ${isBest ? "font-semibold" : "font-medium"}`}
                      >
                        {formatCurrency(card.total)}
                      </p>
                      {card.meta && (
                        <p className="mt-1 text-xs text-gray-400">
                          {card.meta}
                        </p>
                      )}
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isBest ? "bg-orange-500" : "bg-gray-300"}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Resumo da análise */}
        <div className="px-8 sm:px-10 py-8">
          <div className="border-t border-dashed border-gray-200 pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 shrink-0">
                <TrendingUp
                  className="w-5 h-5 text-gray-900"
                  strokeWidth={1.5}
                />
              </div>
              <div className="space-y-2">
                <p className="text-base text-gray-900">
                  A melhor opção é:{" "}
                  <span className="font-semibold text-orange-700">
                    {recommendedLabel}
                  </span>
                </p>
                <ul className="space-y-1.5">
                  {result.savings.vsFinancing > 0 && (
                    <li className="text-sm text-gray-500 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      <span>
                        Você economiza{" "}
                        <strong className="font-medium text-gray-700">
                          {formatCurrency(result.savings.vsFinancing)}
                        </strong>{" "}
                        em relação ao financiamento
                      </span>
                    </li>
                  )}
                  {result.savings.vsRental > 0 && (
                    <li className="text-sm text-gray-500 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      <span>
                        Você economiza{" "}
                        <strong className="font-medium text-gray-700">
                          {formatCurrency(result.savings.vsRental)}
                        </strong>{" "}
                        em relação ao aluguel
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé com ações */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-between items-center">
          <button
            type="button"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 disabled:opacity-50"
            onClick={handleExportReport}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? "Gerando PDF…" : "Exportar relatório"}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 transition-all"
            onClick={handleClose}
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
            Nova simulação
          </button>
        </div>
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
