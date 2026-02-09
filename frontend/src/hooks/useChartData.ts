/**
 * Hook customizado para gerar dados do gráfico de custo acumulado.
 * Calcula a evolução mês a mês de cada opção (aluguel, compra à vista, financiamento)
 * e determina o intervalo ideal de ticks para o eixo X.
 */
import { useMemo } from "react";
import type { CalculationInput, CalculationResult } from "../types/calculator.types";

export interface ChartDataPoint {
  month: number;
  aluguel: number;
  aVista: number;
  financiamento: number;
}

function resolveTickInterval(period: number): number {
  if (period <= 12) return 1;
  if (period <= 24) return 3;
  if (period <= 48) return 6;
  return 12;
}

export function useChartData(
  input: CalculationInput | null | undefined,
  result: CalculationResult
) {
  const data = useMemo<ChartDataPoint[]>(() => {
    if (!input) return [];

    const period = input.comparisonPeriod ?? input.financingTerm;
    const downPayment = input.downPayment ?? 0;
    const { monthlyPayment } = result.financing;

    const points: ChartDataPoint[] = [];

    for (let m = 0; m <= period; m++) {
      points.push({
        month: m,
        aluguel: input.monthlyRent * m,
        aVista: input.carPrice,
        financiamento: downPayment + monthlyPayment * Math.min(m, input.financingTerm),
      });
    }

    return points;
  }, [input, result]);

  const tickInterval = useMemo(() => {
    if (!input) return 1;
    const period = input.comparisonPeriod ?? input.financingTerm;
    return resolveTickInterval(period);
  }, [input]);

  return { data, tickInterval };
}
