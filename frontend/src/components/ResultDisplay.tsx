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
      key: "cash",
      title: "Compra à vista",
      total: result.cash.total,
      meta: null,
    },
    {
      key: "financing",
      title: "Compra financiada",
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
          <h2 className="result-title">Comparação de custos</h2>
          <p className="result-lead">
            Veja o total estimado para cada opção e a recomendação com base no menor custo
          </p>
        </header>

        <div className="result-grid">
          {cards.map((card) => {
            const isBest = card.key === result.recommendation;
            const ariaLabel = isBest
              ? `${card.title} (melhor opção)`
              : card.title;

            return (
              <article
                key={card.key}
                className={`result-card${isBest ? " result-card--best" : ""}`}
                aria-label={ariaLabel}
              >
                {isBest && <span className="result-badge">Melhor opção</span>}
                <h3 className="result-card-title">{card.title}</h3>
                <p className="result-card-value">{formatCurrency(card.total)}</p>
                {card.meta && <p className="result-card-meta">{card.meta}</p>}
              </article>
            );
          })}
        </div>

        <section className="result-recommendation">
          <p className="result-recommendation-title">
            A melhor opção é: <span>{recommendedLabel}</span>
          </p>
          <ul className="result-recommendation-list">
            {result.savings.vsFinancing > 0 && (
              <li>
                Você economiza <strong>{formatCurrency(result.savings.vsFinancing)}</strong> em relação ao
                financiamento
              </li>
            )}
            {result.savings.vsRental > 0 && (
              <li>
                Você economiza <strong>{formatCurrency(result.savings.vsRental)}</strong> em relação ao aluguel
              </li>
            )}
          </ul>
        </section>
      </div>
    </section>
  );
}
