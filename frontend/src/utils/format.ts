/**
 * Utilitários de formatação compartilhados pela aplicação.
 * Centraliza formatação de moeda e mapeamentos de labels para evitar duplicações.
 */
import type { CalculationResult } from "../types/calculator.types";

/**
 * Formata um valor numérico para o padrão monetário brasileiro (BRL).
 */
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

/**
 * Mapeamento entre a chave de recomendação e o label legível para o usuário.
 */
export const optionLabels: Record<CalculationResult["recommendation"], string> = {
  cash: "Compra à vista",
  financing: "Compra financiada",
  rental: "Aluguel",
};
