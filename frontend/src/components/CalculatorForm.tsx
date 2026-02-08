import { useState } from "react";
import { Car, Calendar, DollarSign, Percent, Clock, Repeat2, Calculator } from "lucide-react";
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
    errors.financingTerm = "Informe um prazo válido em meses";
  }

  if (hasValue(state.downPayment)) {
    const downPaymentValue = parseNumber(state.downPayment);
    const carPriceValue = parseNumber(state.carPrice);
    if (downPaymentValue < 0 || (carPriceValue > 0 && downPaymentValue >= carPriceValue)) {
      errors.downPayment = "A entrada deve ser menor que o valor do carro";
    }
  }

  if (hasValue(state.comparisonPeriod) && !isPositiveInteger(state.comparisonPeriod)) {
    errors.comparisonPeriod = "Informe um período válido em meses";
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
        <p className="eyebrow">Comparador Arkar</p>
        <h1 className="calculator-title">Comprar ou alugar?</h1>
        <p className="calculator-lead">
          Entenda o custo total de comprar ou alugar um carro e tome a melhor decisão para o seu momento
        </p>
      </header>

      <div className="form-card">
        <form className="form-body" onSubmit={handleSubmit} noValidate>
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-icon" aria-hidden="true">
                <Car className="w-4 h-4" strokeWidth={1.6} />
              </span>
              Dados do veículo
            </h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="carPrice">Valor do carro (R$)</label>
                <div className="input-wrap">
                  <span className="input-prefix">R$</span>
                  <input
                    id="carPrice"
                    name="carPrice"
                    type="number"
                    placeholder="Ex: 50000"
                    value={formState.carPrice}
                    onChange={handleChange}
                    className={errors.carPrice ? "input-control input-error" : "input-control"}
                    aria-invalid={errors.carPrice ? "true" : "false"}
                  />
                </div>
                {errors.carPrice && (
                  <span className="field-error" role="alert">
                    {errors.carPrice}
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="monthlyRent">Aluguel mensal (R$)</label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    <Calendar className="w-4 h-4" strokeWidth={1.6} />
                  </span>
                  <input
                    id="monthlyRent"
                    name="monthlyRent"
                    type="number"
                    placeholder="Ex: 2000"
                    value={formState.monthlyRent}
                    onChange={handleChange}
                    className={errors.monthlyRent ? "input-control input-error" : "input-control"}
                    aria-invalid={errors.monthlyRent ? "true" : "false"}
                  />
                </div>
                {errors.monthlyRent && (
                  <span className="field-error" role="alert">
                    {errors.monthlyRent}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="section-divider" aria-hidden="true" />

          <div className="form-section">
            <h3 className="section-title">
              <span className="section-icon" aria-hidden="true">
                <DollarSign className="w-4 h-4" strokeWidth={1.6} />
              </span>
              Detalhes do financiamento
            </h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="interestRate">Taxa de juros (% a.m.)</label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    <Percent className="w-4 h-4" strokeWidth={1.6} />
                  </span>
                  <input
                    id="interestRate"
                    name="interestRate"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 1.5"
                    value={formState.interestRate}
                    onChange={handleChange}
                    className={errors.interestRate ? "input-control input-error" : "input-control"}
                    aria-invalid={errors.interestRate ? "true" : "false"}
                  />
                </div>
                {errors.interestRate && (
                  <span className="field-error" role="alert">
                    {errors.interestRate}
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="financingTerm">Prazo do financiamento (meses)</label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    <Clock className="w-4 h-4" strokeWidth={1.6} />
                  </span>
                  <input
                    id="financingTerm"
                    name="financingTerm"
                    type="number"
                    step="1"
                    placeholder="Ex: 48"
                    value={formState.financingTerm}
                    onChange={handleChange}
                    className={errors.financingTerm ? "input-control input-error" : "input-control"}
                    aria-invalid={errors.financingTerm ? "true" : "false"}
                  />
                </div>
                {errors.financingTerm && (
                  <span className="field-error" role="alert">
                    {errors.financingTerm}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="optional-panel">
            <div className="field-grid">
              <div className="field">
                <div className="label-row">
                  <label htmlFor="downPayment">Entrada (R$)</label>
                  <span className="optional-tag">Opcional</span>
                </div>
                <div className="input-wrap">
                  <span className="input-prefix">R$</span>
                  <input
                    id="downPayment"
                    name="downPayment"
                    type="number"
                    placeholder="Ex: 10000"
                    value={formState.downPayment}
                    onChange={handleChange}
                    className={errors.downPayment ? "input-control input-error" : "input-control"}
                    aria-invalid={errors.downPayment ? "true" : "false"}
                  />
                </div>
                {errors.downPayment && (
                  <span className="field-error" role="alert">
                    {errors.downPayment}
                  </span>
                )}
              </div>

              <div className="field">
                <div className="label-row">
                  <label htmlFor="comparisonPeriod">Período de comparação</label>
                  <span className="optional-tag">Meses</span>
                </div>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    <Repeat2 className="w-4 h-4" strokeWidth={1.6} />
                  </span>
                  <input
                    id="comparisonPeriod"
                    name="comparisonPeriod"
                    type="number"
                    step="1"
                    placeholder="Ex: 48"
                    value={formState.comparisonPeriod}
                    onChange={handleChange}
                    className={errors.comparisonPeriod ? "input-control input-error" : "input-control"}
                    aria-invalid={errors.comparisonPeriod ? "true" : "false"}
                  />
                </div>
                {errors.comparisonPeriod && (
                  <span className="field-error" role="alert">
                    {errors.comparisonPeriod}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="submit-row">
            <button className="submit-btn" type="submit" disabled={isLoading}>
              <span className="submit-icon" aria-hidden="true">
                <Calculator className="w-4 h-4" strokeWidth={1.6} />
              </span>
              {isLoading ? "Calculando..." : "Calcular"}
            </button>
            <p className="submit-note">
              Análise objetiva baseada nos custos de compra, financiamento e aluguel
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
