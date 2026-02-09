/**
 * Componente para exibir uma opção de resultado (compra, financiamento ou aluguel).
 * Mostra título, valor total, metadados e barra de progresso visual.
 */
import { formatCurrency } from "../utils/format";

interface ResultCardProps {
  card: {
    key: "cash" | "financing" | "rental";
    title: string;
    total: number;
    meta: string | null;
  };
  isBest: boolean;
  maxTotal: number;
}

export function ResultCard({ card, isBest, maxTotal }: ResultCardProps) {
  const barWidth = maxTotal > 0 ? (card.total / maxTotal) * 100 : 0;
  const ariaLabel = isBest ? `${card.title} (melhor opção)` : card.title;

  return (
    <article
      className={
        isBest
          ? "relative group rounded-xl border-2 border-orange-600/20 bg-orange-50/20 p-5 transition-all hover:border-orange-600/30 dark:border-orange-400/30 dark:bg-orange-500/10"
          : "relative rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 transition-all dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
      }
      aria-label={ariaLabel}
    >
      {isBest && (
        <div className="absolute -top-3 left-4">
          <span className="bg-orange-700 text-white text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide shadow-sm inline-flex items-center gap-1">
            🏆 Melhor opção
          </span>
        </div>
      )}

      <div className="mt-2 space-y-4">
        <div>
          <h3
            className={`text-sm font-medium ${
              isBest ? "text-gray-900 dark:text-slate-100" : "text-gray-600 dark:text-slate-400"
            }`}
          >
            {card.title}
          </h3>
          <p
            className={`mt-2 text-2xl tracking-tight text-gray-900 dark:text-slate-100 ${
              isBest ? "font-semibold" : "font-medium"
            }`}
          >
            {formatCurrency(card.total)}
          </p>
          {card.meta && (
            <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
              {card.meta}
            </p>
          )}
        </div>
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isBest ? "bg-orange-500" : "bg-gray-300 dark:bg-slate-600"
            }`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </article>
  );
}
