export interface CalculationInput {
  carPrice: number;
  monthlyRent: number;
  interestRate: number;
  financingTerm: number;
  downPayment?: number;
  comparisonPeriod?: number;
}

export interface CashResult {
  total: number;
}

export interface FinancingResult {
  monthlyPayment: number;
  total: number;
}

export interface RentalResult {
  total: number;
}

export interface Savings {
  vsFinancing: number;
  vsRental: number;
}

export interface CalculationResult {
  cash: CashResult;
  financing: FinancingResult;
  rental: RentalResult;
  recommendation: "cash" | "financing" | "rental";
  savings: Savings;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  details?: ValidationError[];

  constructor(response: { error: string; details?: ValidationError[] }) {
    super(response.error);
    if (response.details) {
      this.details = response.details;
    }
  }
}
