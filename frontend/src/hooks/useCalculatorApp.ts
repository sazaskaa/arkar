/**
 * Hook customizado para gerenciar o estado e lógica principal da aplicação de calculadora.
 * Inclui estados para resultado, input, loading, erro e animações, além de handlers para cálculo e fechamento.
 */
import { useState } from "react";
import { calculateComparison } from "../services/api.service";
import { ApiError } from "../types/calculator.types";
import type { CalculationInput, CalculationResult } from "../types/calculator.types";

const GENERIC_ERROR_MESSAGE = "Ocorreu um erro ao calcular. Tente novamente.";

export function useCalculatorApp() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [lastInput, setLastInput] = useState<CalculationInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  /**
   * Executa o cálculo assincronamente, gerenciando estados de loading e erro para melhorar UX.
   * Trata erros específicos da API para fornecer feedback contextual ao usuário.
   */
  const handleCalculate = async (input: CalculationInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const nextResult = await calculateComparison(input);
      setLastInput(input);
      setResult(nextResult);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : GENERIC_ERROR_MESSAGE;
      setError(message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fecha o resultado com animação, aguardando 300ms para completar a transição visual antes de limpar estado.
   * Melhora UX evitando mudanças abruptas na interface.
   */
  const handleCloseResult = () => {
    setIsClosing(true);
    setTimeout(() => {
      setResult(null);
      setIsClosing(false);
    }, 300);
  };

  const handleCloseError = () => {
    setIsClosing(true);
    setTimeout(() => {
      setError(null);
      setIsClosing(false);
    }, 300);
  };

  return {
    result,
    lastInput,
    isLoading,
    error,
    isClosing,
    handleCalculate,
    handleCloseResult,
    handleCloseError,
  };
}