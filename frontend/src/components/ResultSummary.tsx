/**
 * Componente para o resumo da análise de custos.
 * Exibe a recomendação da melhor opção e economias em relação às outras.
 */
import { TrendingUp, Check } from "lucide-react";
import type { CalculationResult } from "../types/calculator.types";
import { formatCurrency, optionLabels } from "../utils/format";

interface ResultSummaryProps {
  result: CalculationResult;
}

export function ResultSummary({ result }: ResultSummaryProps) {
  const recommendedLabel = optionLabels[result.recommendation];

  return (
    <div className="border-t border-dashed border-gray-200 pt-6 dark:border-slate-800">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 shrink-0 dark:bg-slate-800 dark:border-slate-700">
          <TrendingUp className="w-5 h-5 text-gray-900 dark:text-slate-100" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <p className="text-base text-gray-900 dark:text-slate-100">
            A melhor opção é:{" "}
            <span className="font-semibold text-orange-700 dark:text-orange-300">
              {recommendedLabel}
            </span>
          </p>
          <ul className="space-y-1.5">
            {result.savings.vsFinancing > 0 && (
              <li className="text-sm text-gray-500 flex items-center gap-2 dark:text-slate-400">
                <Check className="w-3.5 h-3.5 text-green-600 shrink-0 dark:text-green-400" />
                <span>
                  Você economiza{" "}
                  <strong className="font-medium text-gray-700 dark:text-slate-200">
                    {formatCurrency(result.savings.vsFinancing)}
                  </strong>{" "}
                  em relação ao financiamento
                </span>
              </li>
            )}
            {result.savings.vsRental > 0 && (
              <li className="text-sm text-gray-500 flex items-center gap-2 dark:text-slate-400">
                <Check className="w-3.5 h-3.5 text-green-600 shrink-0 dark:text-green-400" />
                <span>
                  Você economiza{" "}
                  <strong className="font-medium text-gray-700 dark:text-slate-200">
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
  );
}
