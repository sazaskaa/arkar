import type { CalculationResult } from "../types/calculator.types";

interface ResultDisplayProps {
  result: CalculationResult;
}

const optionLabels: Record<CalculationResult["recommendation"], string> = {
  cash: "Compra a Vista",
  financing: "Compra Financiada",
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
      key: "cash",
      title: "Compra a Vista",
      total: result.cash.total,
      meta: null,
    },
    {
      key: "financing",
      title: "Compra Financiada",
      total: result.financing.total,
      meta: `Parcela: ${formatCurrency(result.financing.monthlyPayment)}/mes`,
    },
    {
      key: "rental",
      title: "Aluguel",
      total: result.rental.total,
      meta: null,
    },
  ] as const;

  return (
    <section className="result-shell" aria-live="polite">
      <div className="result-section">
        <header className="result-header">
          <p className="eyebrow">Resultado</p>
          <h2 className="result-title">Comparacao de custos</h2>
          <p className="result-lead">
            Veja o total estimado para cada opcao e a recomendacao com base no menor custo.
          </p>
        </header>

        <div className="result-grid">
          {cards.map((card) => {
            const isBest = card.key === result.recommendation;
            const ariaLabel = isBest
              ? `${card.title} (melhor opcao)`
              : card.title;

            return (
              <article
                key={card.key}
                className={`result-card${isBest ? " result-card--best" : ""}`}
                aria-label={ariaLabel}
              >
                {isBest && <span className="result-badge">Melhor opcao</span>}
                <h3 className="result-card-title">{card.title}</h3>
                <p className="result-card-value">{formatCurrency(card.total)}</p>
                {card.meta && <p className="result-card-meta">{card.meta}</p>}
              </article>
            );
          })}
        </div>

        <section className="result-recommendation">
          <p className="result-recommendation-title">
            A melhor opcao e: <span>{recommendedLabel}</span>
          </p>
          <ul className="result-recommendation-list">
            {result.savings.vsFinancing > 0 && (
              <li>
                Voce economiza <strong>{formatCurrency(result.savings.vsFinancing)}</strong> em relacao ao
                financiamento.
              </li>
            )}
            {result.savings.vsRental > 0 && (
              <li>
                Voce economiza <strong>{formatCurrency(result.savings.vsRental)}</strong> em relacao ao aluguel.
              </li>
            )}
          </ul>
        </section>
      </div>
    </section>
  );
}
