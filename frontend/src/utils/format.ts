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
 * Formata um número para exibição em campos de entrada, com separadores de milhares.
 */
export const formatNumberForInput = (value: number): string => {
  if (isNaN(value)) return '';
  return new Intl.NumberFormat("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Remove formatação de número (pontos e vírgulas) para obter o valor numérico como string.
 */
export const parseFormattedNumber = (value: string): string => {
  return value.replace(/\./g, '').replace(',', '');
};

/**
 * Mapeamento entre a chave de recomendação e o label legível para o usuário.
 */
export const optionLabels: Record<CalculationResult["recommendation"], string> = {
  cash: "Compra à vista",
  financing: "Compra financiada",
  rental: "Aluguel",
};
