import { ApiError } from "../types/calculator.types";
import type {
  CalculationInput,
  CalculationResult,
  ValidationError,
} from "../types/calculator.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

type ErrorResponse = {
  error?: string;
  details?: ValidationError[];
};

const GENERIC_ERROR_MESSAGE = "Ocorreu um erro ao calcular. Tente novamente.";
const NETWORK_ERROR_MESSAGE = "Nao foi possivel conectar ao servidor";

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function buildApiError(payload: ErrorResponse | null): ApiError {
  if (payload?.error) {
    return new ApiError({ error: payload.error, details: payload.details });
  }

  return new ApiError({ error: GENERIC_ERROR_MESSAGE });
}

export async function calculateComparison(
  input: CalculationInput
): Promise<CalculationResult> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch {
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
