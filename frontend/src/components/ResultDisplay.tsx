import { Trophy, TrendingUp, Check, Download, RotateCcw } from "lucide-react";
import type { CalculationResult } from "../types/calculator.types";

interface ResultDisplayProps {
  result: CalculationResult;
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

export function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) {
    return null;
  }

  const recommendedLabel = optionLabels[result.recommendation];

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
    <section className="result-shell" aria-live="polite">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 overflow-hidden animate-[fade-up_0.6s_ease_both_0.12s]">
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
            Veja o total estimado para cada opção e a recomendação com base no menor custo financeiro ao final do período.
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
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4" />
            Exportar relatório
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 transition-all"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
            Recalcular
          </button>
        </div>
      </div>
    </section>
  );
}
