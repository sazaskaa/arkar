import type {
  CalculationInput,
  CalculationResult,
  FinancingResult,
  RentalResult,
  CashResult,
} from "../types/calculator.types";

/**
 * Arredonda um valor para 2 casas decimais para representar valores monetários com precisão,
 * evitando erros de ponto flutuante em somas e comparações financeiras.
 */
const round2 = (value: number): number => Math.round(value * 100) / 100;

/**
 * Calcula o custo total à vista (igual ao preço do carro).
 * Representa a opção mais simples, sem juros ou parcelas, para comparação com outras alternativas.
 */
const calculateCash = (carPrice: number): CashResult => ({
  total: round2(carPrice),
});

/**
 * Calcula o financiamento: parcela mensal e total pago (entrada + parcelas).
 * Usa fórmula de amortização com juros compostos para simular custos reais de empréstimo bancário.
 */
const calculateFinancing = (
  carPrice: number,
  downPayment: number,
  interestRate: number,
  financingTerm: number
): FinancingResult => {
  const financedAmount = carPrice - downPayment;
  const monthlyRate = interestRate / 100;

  const monthlyPaymentRaw =
    (financedAmount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -financingTerm));
  const monthlyPayment = round2(monthlyPaymentRaw);
  const total = round2(downPayment + monthlyPayment * financingTerm);

  return {
    monthlyPayment,
    total,
  };
};

/**
 * Calcula o custo total do aluguel no período de comparação.
 * Permite avaliar o custo acumulado de aluguel versus compra, considerando flexibilidade de curto prazo.
 */
const calculateRental = (monthlyRent: number, comparisonPeriod: number): RentalResult => ({
  total: round2(monthlyRent * comparisonPeriod),
});

/**
 * Escolhe a recomendação baseada no menor custo total (prioridade: à vista > financiamento > aluguel).
 * Prioriza à vista para incentivar economia, seguido de financiamento como alternativa estruturada.
 */
const pickRecommendation = (
  cashTotal: number,
  financingTotal: number,
  rentalTotal: number
): "cash" | "financing" | "rental" => {
  const minTotal = Math.min(cashTotal, financingTotal, rentalTotal);
  if (cashTotal === minTotal) {
    return "cash";
  }
  if (financingTotal === minTotal) {
    return "financing";
  }
  return "rental";
};

/**
 * Função principal que calcula todas as opções (à vista, financiamento, aluguel) e retorna recomendação.
 * Centraliza a lógica de negócio para ser reutilizada e testada independentemente da camada HTTP.
 */
export const calculate = (input: CalculationInput): CalculationResult => {
  const downPayment = input.downPayment ?? 0;
  const comparisonPeriod = input.comparisonPeriod ?? input.financingTerm;

  const cash = calculateCash(input.carPrice);
  const financing = calculateFinancing(
    input.carPrice,
    downPayment,
    input.interestRate,
    input.financingTerm
  );
  const rental = calculateRental(input.monthlyRent, comparisonPeriod);

  const recommendation = pickRecommendation(
    cash.total,
    financing.total,
    rental.total
  );

  const minTotal = Math.min(cash.total, financing.total, rental.total);
  const savings = {
    vsFinancing: round2(financing.total - minTotal),
    vsRental: round2(rental.total - minTotal),
  };

  return {
    cash,
    financing,
    rental,
    recommendation,
    savings,
  };
};
