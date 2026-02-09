/**
 * Serviço de integração com a API do backend.
 * Abstrai chamadas HTTP para centralizar tratamento de erros e garantir type-safety,
 * evitando duplicação de lógica de fetch em componentes e melhorando manutenibilidade.
 */
import { ApiError } from "../types/calculator.types";
import type {
  CalculationInput,
  CalculationResult,
  ValidationError,
} from "../types/calculator.types";

const API_BASE_URLS = (import.meta.env.VITE_API_URLS ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001")
  .split(",")
  .map((url: string) => url.trim())
  .filter(Boolean);

type ErrorResponse = {
  error?: string;
  details?: ValidationError[];
};

const GENERIC_ERROR_MESSAGE = "Ocorreu um erro ao calcular. Tente novamente.";
const NETWORK_ERROR_MESSAGE = "Não foi possível conectar ao servidor";

/**
 * Faz parsing seguro de JSON para evitar crashes em respostas malformadas.
 * Retorna null em caso de erro, permitindo tratamento gracioso.
 */
async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Constrói erro padronizado da API a partir da resposta, preservando detalhes de validação.
 * Facilita tratamento uniforme de erros no frontend.
 */
function buildApiError(payload: ErrorResponse | null): ApiError {
  if (payload?.error) {
    return new ApiError({ error: payload.error, details: payload.details });
  }

  return new ApiError({ error: GENERIC_ERROR_MESSAGE });
}

/**
 * Envia dados de cálculo para o backend e retorna resultado ou lança erro.
 * Centraliza comunicação assíncrona para isolamento de lógica de negócio.
 */
export async function calculateComparison(
  input: CalculationInput
): Promise<CalculationResult> {
  let response: Response | null = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      response = await fetch(`${baseUrl}/api/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      break;
    } catch {
    }
  }

  if (!response) {
    throw new ApiError({ error: NETWORK_ERROR_MESSAGE });
  }

  const payload = await parseJsonSafe<CalculationResult | ErrorResponse>(response);

  if (!response.ok) {
    throw buildApiError(payload as ErrorResponse | null);
  }

  if (!payload) {
    throw new ApiError({ error: GENERIC_ERROR_MESSAGE });
  }

  return payload as CalculationResult;
}
