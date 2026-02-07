import type {
  CalculationInput,
  CalculationResult,
  FinancingResult,
  RentalResult,
  CashResult,
} from "../types/calculator.types";

const round2 = (value: number): number => Math.round(value * 100) / 100;

const calculateCash = (carPrice: number): CashResult => ({
  total: round2(carPrice),
});

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

const calculateRental = (monthlyRent: number, comparisonPeriod: number): RentalResult => ({
  total: round2(monthlyRent * comparisonPeriod),
});

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
