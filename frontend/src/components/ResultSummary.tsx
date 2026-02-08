/**
 * Componente para o resumo da análise de custos.
 * Exibe a recomendação da melhor opção e economias em relação às outras.
 */
import { TrendingUp, Check } from "lucide-react";
import type { CalculationResult } from "../types/calculator.types";

interface ResultSummaryProps {
  result: CalculationResult;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export function ResultSummary({ result }: ResultSummaryProps) {
  const optionLabels: Record<CalculationResult["recommendation"], string> = {
    cash: "Compra à vista",
    financing: "Compra financiada",
    rental: "Aluguel",
  };

  const recommendedLabel = optionLabels[result.recommendation];

  return (
    <div className="border-t border-dashed border-gray-200 pt-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 shrink-0">
          <TrendingUp className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
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
  );
}
