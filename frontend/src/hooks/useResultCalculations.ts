/**
 * Hook customizado para calcular e preparar dados dos resultados.
 * Gera cards de opções, valor máximo e formatação de moeda.
 */
import { useMemo } from "react";
import type { CalculationResult } from "../types/calculator.types";
import { formatCurrency } from "../utils/format";

export function useResultCalculations(result: CalculationResult) {
  const cards = useMemo(() => [
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
  ], [result]);

  const maxTotal = useMemo(() => Math.max(...cards.map((c) => c.total)), [cards]);

  return { cards, maxTotal };
}
