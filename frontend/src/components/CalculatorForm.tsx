import { useState } from "react";
import type { CalculationInput } from "../types/calculator.types";

interface CalculatorFormProps {
  onSubmit: (data: CalculationInput) => void;
  isLoading: boolean;
}

interface FormState {
  carPrice: string;
  monthlyRent: string;
  interestRate: string;
  financingTerm: string;
  downPayment: string;
  comparisonPeriod: string;
}

interface FormErrors {
  carPrice?: string;
  monthlyRent?: string;
  interestRate?: string;
  financingTerm?: string;
  downPayment?: string;
  comparisonPeriod?: string;
}

const initialState: FormState = {
  carPrice: "",
  monthlyRent: "",
  interestRate: "",
  financingTerm: "",
  downPayment: "",
  comparisonPeriod: "",
};

const parseNumber = (value: string) => Number(value);

const hasValue = (value: string) => value.trim() !== "";

const isPositive = (value: string) => hasValue(value) && parseNumber(value) > 0;

const isPositiveInteger = (value: string) => {
  if (!hasValue(value)) {
    return false;
  }
  const numericValue = parseNumber(value);
  return Number.isInteger(numericValue) && numericValue > 0;
};

const validateForm = (state: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!isPositive(state.carPrice)) {
    errors.carPrice = "Informe um valor maior que zero";
  }

  if (!isPositive(state.monthlyRent)) {
    errors.monthlyRent = "Informe um valor maior que zero";
  }

  if (!isPositive(state.interestRate)) {
    errors.interestRate = "Informe uma taxa maior que zero";
  }

  if (!isPositiveInteger(state.financingTerm)) {
    errors.financingTerm = "Informe um prazo valido em meses";
  }

  if (hasValue(state.downPayment)) {
    const downPaymentValue = parseNumber(state.downPayment);
    const carPriceValue = parseNumber(state.carPrice);
    if (downPaymentValue < 0 || (carPriceValue > 0 && downPaymentValue >= carPriceValue)) {
      errors.downPayment = "A entrada deve ser menor que o valor do carro";
    }
  }

  if (hasValue(state.comparisonPeriod) && !isPositiveInteger(state.comparisonPeriod)) {
    errors.comparisonPeriod = "Informe um periodo valido em meses";
  }

  return errors;
};

export function CalculatorForm({ onSubmit, isLoading }: CalculatorFormProps) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(formState);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const financingTermValue = parseNumber(formState.financingTerm);
    const comparisonPeriodValue = hasValue(formState.comparisonPeriod)
      ? parseNumber(formState.comparisonPeriod)
      : financingTermValue;
    const downPaymentValue = hasValue(formState.downPayment)
      ? parseNumber(formState.downPayment)
      : 0;

    onSubmit({
      carPrice: parseNumber(formState.carPrice),
      monthlyRent: parseNumber(formState.monthlyRent),
      interestRate: parseNumber(formState.interestRate),
      financingTerm: financingTermValue,
      downPayment: downPaymentValue,
      comparisonPeriod: comparisonPeriodValue,
    });
  };

  return (
    <section className="calculator-shell">
      <header className="calculator-header">
        <p className="eyebrow">Comparador</p>
        <h1 className="calculator-title">Arkar</h1>
        <p className="calculator-lead">
          Entenda o custo total de comprar ou alugar um carro e tome a melhor decisão para o seu momento.
        </p>
      </header>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="carPrice">Valor do carro (R$)</label>
            <input
              id="carPrice"
              name="carPrice"
              type="number"
              placeholder="Ex: 50000"
              value={formState.carPrice}
              onChange={handleChange}
              className={errors.carPrice ? "input-error" : undefined}
              aria-invalid={errors.carPrice ? "true" : "false"}
            />
            {errors.carPrice && (
              <span className="field-error" role="alert">
                {errors.carPrice}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="monthlyRent">Aluguel mensal (R$)</label>
            <input
              id="monthlyRent"
              name="monthlyRent"
              type="number"
              placeholder="Ex: 2000"
              value={formState.monthlyRent}
              onChange={handleChange}
              className={errors.monthlyRent ? "input-error" : undefined}
              aria-invalid={errors.monthlyRent ? "true" : "false"}
            />
            {errors.monthlyRent && (
              <span className="field-error" role="alert">
                {errors.monthlyRent}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="interestRate">Taxa de juros (% a.m.)</label>
            <input
              id="interestRate"
              name="interestRate"
              type="number"
              step="0.01"
              placeholder="Ex: 1.5"
              value={formState.interestRate}
              onChange={handleChange}
              className={errors.interestRate ? "input-error" : undefined}
              aria-invalid={errors.interestRate ? "true" : "false"}
            />
            {errors.interestRate && (
              <span className="field-error" role="alert">
                {errors.interestRate}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="financingTerm">Prazo do financiamento (meses)</label>
            <input
              id="financingTerm"
              name="financingTerm"
              type="number"
              step="1"
              placeholder="Ex: 48"
              value={formState.financingTerm}
              onChange={handleChange}
              className={errors.financingTerm ? "input-error" : undefined}
              aria-invalid={errors.financingTerm ? "true" : "false"}
            />
            {errors.financingTerm && (
              <span className="field-error" role="alert">
                {errors.financingTerm}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="downPayment">
              Entrada (R$) <span className="optional-text">(opcional)</span>
            </label>
            <input
              id="downPayment"
              name="downPayment"
              type="number"
              placeholder="Ex: 10000"
              value={formState.downPayment}
              onChange={handleChange}
              className={errors.downPayment ? "input-error" : undefined}
              aria-invalid={errors.downPayment ? "true" : "false"}
            />
            {errors.downPayment && (
              <span className="field-error" role="alert">
                {errors.downPayment}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="comparisonPeriod">
              Periodo de comparação (meses) <span className="optional-text">(opcional)</span>
            </label>
            <input
              id="comparisonPeriod"
              name="comparisonPeriod"
              type="number"
              step="1"
              placeholder="Ex: 48"
              value={formState.comparisonPeriod}
              onChange={handleChange}
              className={errors.comparisonPeriod ? "input-error" : undefined}
              aria-invalid={errors.comparisonPeriod ? "true" : "false"}
            />
            {errors.comparisonPeriod && (
              <span className="field-error" role="alert">
                {errors.comparisonPeriod}
              </span>
            )}
          </div>
        </div>

        <div className="submit-row">
          <button className="submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Calculando..." : "Calcular"}
          </button>
        </div>
      </form>
    </section>
  );
}
