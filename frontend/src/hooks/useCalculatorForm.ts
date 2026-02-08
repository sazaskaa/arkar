/**
 * Hook customizado para gerenciar o estado e lógica do formulário de cálculo.
 * Inclui validações, manipulação de inputs e submissão de dados.
 */
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import type { CalculationInput } from "../types/calculator.types";
import { formatNumberForInput, parseFormattedNumber } from "../utils/format";

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

const parseNumber = (value: string) => {
  const num = Number(value);
  return Number.isNaN(num) ? NaN : num;
};

const hasValue = (value: string) => value.trim() !== "";

const isNumeric = (value: string) => hasValue(value) && !Number.isNaN(parseNumber(value));

const isPositive = (value: string) => isNumeric(value) && parseNumber(value) > 0;

const isPositiveInteger = (value: string) => {
  if (!isNumeric(value)) {
    return false;
  }
  const numericValue = parseNumber(value);
  return Number.isInteger(numericValue) && numericValue > 0;
};

/**
 * Valida o estado do formulário aplicando regras específicas por campo.
 * Garante que dados inválidos não sejam enviados ao backend, melhorando UX com feedback imediato.
 */
const validateForm = (state: FormState): FormErrors => {
  const errors: FormErrors = {};

  // Define regras de validação por campo
  const validationRules: Array<{
    field: keyof FormState;
    validator: (value: string, fullState?: FormState) => string | undefined;
  }> = [
    {
      field: 'carPrice',
      validator: (value) => (!isPositive(value) ? "Informe um valor maior que zero" : undefined),
    },
    {
      field: 'monthlyRent',
      validator: (value) => (!isPositive(value) ? "Informe um valor maior que zero" : undefined),
    },
    {
      field: 'interestRate',
      validator: (value) => (!isPositive(value) ? "Informe uma taxa maior que zero" : undefined),
    },
    {
      field: 'financingTerm',
      validator: (value) => (!isPositiveInteger(value) ? "Informe um prazo válido em meses" : undefined),
    },
    {
      field: 'downPayment',
      validator: (value, fullState) => {
        if (!hasValue(value)) return undefined;
        if (!isNumeric(value)) return "Informe um valor numérico válido";
        const downPaymentValue = parseNumber(value);
        const carPriceValue = parseNumber(fullState!.carPrice);
        if (downPaymentValue < 0 || (carPriceValue > 0 && downPaymentValue >= carPriceValue)) {
          return "A entrada deve ser menor que o valor do carro";
        }
        return undefined;
      },
    },
    {
      field: 'comparisonPeriod',
      validator: (value) => {
        if (!hasValue(value)) return undefined;
        if (!isNumeric(value)) return "Informe um valor numérico válido";
        if (!isPositiveInteger(value)) return "Informe um período válido em meses";
        return undefined;
      },
    },
  ];

  // Aplica as validações
  for (const { field, validator } of validationRules) {
    const error = validator(state[field], state);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
};

export function useCalculatorForm(onSubmit: (data: CalculationInput) => void) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [displayState, setDisplayState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'carPrice' || name === 'monthlyRent' || name === 'downPayment') {
      const cleaned = parseFormattedNumber(value);
      setFormState((previous) => ({
        ...previous,
        [name]: cleaned,
      }));
      const num = parseFloat(cleaned);
      const formatted = isNaN(num) ? '' : formatNumberForInput(num);
      setDisplayState((previous) => ({
        ...previous,
        [name]: formatted,
      }));
    } else {
      setFormState((previous) => ({
        ...previous,
        [name]: value,
      }));
      setDisplayState((previous) => ({
        ...previous,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

  return {
    formState: displayState,
    errors,
    handleChange,
    handleSubmit,
  };
}
