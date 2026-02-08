import { Router } from "express";
import { calculate } from "../services/calculator.service";
import type { CalculationInput, ValidationError } from "../types/calculator.types";

const router = Router();

/**
 * Garante que entradas numéricas sejam válidas para evitar erros em cálculos financeiros,
 * onde NaN causaria resultados incorretos ou exceções.
 */
const isNumber = (value: unknown): value is number =>
  typeof value === "number" && !Number.isNaN(value);

/**
 * Rota POST para calcular opções de compra/aluguel/financiamento de carro.
 * Recebe dados do frontend, valida entradas, executa cálculo e retorna resultado com recomendação.
 * Necessária para processar requisições HTTP e integrar com o frontend separado.
 */
router.post("/calculate", (req, res) => {
  try {
    const downPaymentErrorMessage = "A entrada deve ser um número não negativo e menor que o valor do carro";

    const {
      carPrice,
      monthlyRent,
      interestRate,
      financingTerm,
      downPayment: rawDownPayment,
      comparisonPeriod: rawComparisonPeriod,
    } = req.body as Partial<CalculationInput>;

    const downPayment = rawDownPayment ?? 0;
    const comparisonPeriod = rawComparisonPeriod ?? financingTerm;

    const errors: ValidationError[] = [];

    if (!isNumber(carPrice) || carPrice <= 0) {
      errors.push({
        field: "carPrice",
        message: "O valor do carro é obrigatório e deve ser maior que zero",
      });
    }

    if (!isNumber(monthlyRent) || monthlyRent <= 0) {
      errors.push({
        field: "monthlyRent",
        message: "O valor do aluguel é obrigatório e deve ser maior que zero",
      });
    }

    if (!isNumber(interestRate) || interestRate <= 0) {
      errors.push({
        field: "interestRate",
        message: "A taxa de juros é obrigatória e deve ser maior que zero",
      });
    }

    if (!isNumber(financingTerm) || !Number.isInteger(financingTerm) || financingTerm <= 0) {
      errors.push({
        field: "financingTerm",
        message:
          "O prazo do financiamento é obrigatório e deve ser um inteiro maior que zero",
      });
    }

    if (rawDownPayment !== undefined) {
      if (!isNumber(downPayment) || downPayment < 0) {
        errors.push({
          field: "downPayment",
          message: downPaymentErrorMessage,
        });
      } else if (isNumber(carPrice) && downPayment >= carPrice) {
        errors.push({
          field: "downPayment",
          message: downPaymentErrorMessage,
        });
      }
    }

    if (rawComparisonPeriod !== undefined) {
      if (
        !isNumber(comparisonPeriod) ||
        !Number.isInteger(comparisonPeriod) ||
        comparisonPeriod <= 0
      ) {
        errors.push({
          field: "comparisonPeriod",
          message: "O período de comparação deve ser um inteiro maior que zero",
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Dados de entrada inválidos",
        details: errors,
      });
    }

    const input: CalculationInput = {
      carPrice: carPrice as number,
      monthlyRent: monthlyRent as number,
      interestRate: interestRate as number,
      financingTerm: financingTerm as number,
      downPayment: downPayment as number,
      comparisonPeriod: comparisonPeriod as number,
    };

    const result = calculate(input);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Erro no cálculo:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
