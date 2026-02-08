/**
 * Componente para exibir uma opção de resultado (compra, financiamento ou aluguel).
 * Mostra título, valor total, metadados e barra de progresso visual.
 */
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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export function ResultCard({ card, isBest, maxTotal }: ResultCardProps) {
  const barWidth = maxTotal > 0 ? (card.total / maxTotal) * 100 : 0;
  const ariaLabel = isBest ? `${card.title} (melhor opção)` : card.title;

  return (
    <article
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
            🏆 Melhor opção
          </span>
        </div>
      )}

      <div className="mt-2 space-y-4">
        <div>
          <h3 className={`text-sm font-medium ${isBest ? "text-gray-900" : "text-gray-600"}`}>
            {card.title}
          </h3>
          <p className={`mt-2 text-2xl tracking-tight text-gray-900 ${isBest ? "font-semibold" : "font-medium"}`}>
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
}
