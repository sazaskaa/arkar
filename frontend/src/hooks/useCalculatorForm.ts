/**
 * Hook customizado para gerenciar o estado e lógica do formulário de cálculo.
 * Inclui validações, manipulação de inputs e submissão de dados.
 */
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import type { CalculationInput } from "../types/calculator.types";

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
    if (!isNumeric(state.downPayment)) {
      errors.downPayment = "Informe um valor numérico válido";
    } else {
      const downPaymentValue = parseNumber(state.downPayment);
      const carPriceValue = parseNumber(state.carPrice);
      if (downPaymentValue < 0 || (carPriceValue > 0 && downPaymentValue >= carPriceValue)) {
        errors.downPayment = "A entrada deve ser menor que o valor do carro";
      }
    }
  }

  if (hasValue(state.comparisonPeriod)) {
    if (!isNumeric(state.comparisonPeriod)) {
      errors.comparisonPeriod = "Informe um valor numérico válido";
    } else if (!isPositiveInteger(state.comparisonPeriod)) {
      errors.comparisonPeriod = "Informe um período válido em meses";
    }
  }

  return errors;
};

export function useCalculatorForm(onSubmit: (data: CalculationInput) => void) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((previous) => ({
      ...previous,
      [name]: value,
    }));
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
    formState,
    errors,
    handleChange,
    handleSubmit,
  };
}
