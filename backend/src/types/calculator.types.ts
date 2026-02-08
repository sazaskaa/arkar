/**
 * Dados de entrada enviados pelo frontend para o cálculo.
 * Estrutura padronizada para garantir consistência na comunicação front-back.
 */
export interface CalculationInput {
  carPrice: number;
  monthlyRent: number;
  interestRate: number;
  financingTerm: number;
  downPayment?: number;
  comparisonPeriod?: number;
}

/**
 * Resultado do cálculo à vista: custo total igual ao preço do carro.
 * Representa baseline para comparação com opções parceladas.
 */
export interface CashResult {
  total: number;
}

/**
 * Resultado do financiamento: parcela mensal e custo total (entrada + parcelas).
 * Detalha custos mensais para planejamento financeiro do usuário.
 */
export interface FinancingResult {
  monthlyPayment: number;
  total: number;
}

/**
 * Resultado do aluguel: custo total no período de comparação.
 * Permite comparar custo acumulado versus propriedade.
 */
export interface RentalResult {
  total: number;
}

export interface Savings {
  vsFinancing: number;
  vsRental: number;
}

/**
 * Resultado completo do cálculo, enviado de volta ao frontend.
 * Inclui todas as opções e recomendação para exibição na interface.
 */
export interface CalculationResult {
  cash: CashResult;
  financing: FinancingResult;
  rental: RentalResult;
  recommendation: "cash" | "financing" | "rental";
  savings: Savings;
}

/**
 * Erro de validação para campos específicos, usado na resposta de erro.
 * Permite ao frontend destacar campos inválidos e mostrar mensagens contextuais.
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Classe de erro para respostas da API, com detalhes opcionais de validação.
 * Padroniza tratamento de erros entre frontend e backend.
 */
export class ApiError extends Error {
  details?: ValidationError[];

  constructor(response: { error: string; details?: ValidationError[] }) {
    super(response.error);
    if (response.details !== undefined) {
      this.details = response.details;
    }
  }
}
