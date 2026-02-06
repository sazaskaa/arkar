# Spec: Tipos e Modelos

## Objetivo
Definir todas as interfaces e tipos TypeScript compartilhados entre frontend e backend.

---

## Tipos de Entrada (Request)

### `CalculationInput`

| Campo              | Tipo     | Obrigatório | Descrição                                  | Validação                     |
| ------------------ | -------- | ----------- | ------------------------------------------ | ----------------------------- |
| `carPrice`         | `number` | Sim         | Preço do veículo (R$)                      | > 0                           |
| `monthlyRent`      | `number` | Sim         | Custo mensal do aluguel (R$)               | > 0                           |
| `interestRate`     | `number` | Sim         | Taxa de juros mensal (%)                   | > 0                           |
| `financingTerm`    | `number` | Sim         | Prazo do financiamento em meses            | Inteiro, > 0                  |
| `downPayment`      | `number` | Não         | Valor de entrada (R$). Padrão: `0`         | >= 0, < `carPrice`            |
| `comparisonPeriod` | `number` | Não         | Meses para comparar. Padrão: `financingTerm` | Inteiro, > 0               |

```typescript
interface CalculationInput {
  carPrice: number;
  monthlyRent: number;
  interestRate: number;
  financingTerm: number;
  downPayment?: number;
  comparisonPeriod?: number;
}
```

---

## Tipos de Saída (Response)

### `CashResult`

| Campo   | Tipo     | Descrição                 |
| ------- | -------- | ------------------------- |
| `total` | `number` | Custo total da compra à vista |

```typescript
interface CashResult {
  total: number;
}
```

### `FinancingResult`

| Campo            | Tipo     | Descrição                       |
| ---------------- | -------- | ------------------------------- |
| `monthlyPayment` | `number` | Valor da parcela mensal (R$)    |
| `total`          | `number` | Custo total do financiamento    |

```typescript
interface FinancingResult {
  monthlyPayment: number;
  total: number;
}
```

### `RentalResult`

| Campo   | Tipo     | Descrição                     |
| ------- | -------- | ----------------------------- |
| `total` | `number` | Custo total do aluguel        |

```typescript
interface RentalResult {
  total: number;
}
```

### `Savings`

| Campo          | Tipo     | Descrição                                          |
| -------------- | -------- | -------------------------------------------------- |
| `vsFinancing`  | `number` | Economia da melhor opção vs financiamento           |
| `vsRental`     | `number` | Economia da melhor opção vs aluguel                 |

```typescript
interface Savings {
  vsFinancing: number;
  vsRental: number;
}
```

### `CalculationResult`

| Campo            | Tipo                                    | Descrição                                  |
| ---------------- | --------------------------------------- | ------------------------------------------ |
| `cash`           | `CashResult`                            | Resultado da compra à vista                |
| `financing`      | `FinancingResult`                       | Resultado da compra financiada             |
| `rental`         | `RentalResult`                          | Resultado do aluguel                       |
| `recommendation` | `'cash' \| 'financing' \| 'rental'`     | Opção mais vantajosa                       |
| `savings`        | `Savings`                               | Economia comparativa                       |

```typescript
interface CalculationResult {
  cash: CashResult;
  financing: FinancingResult;
  rental: RentalResult;
  recommendation: 'cash' | 'financing' | 'rental';
  savings: Savings;
}
```

---

## Tipos de Erro

### `ValidationError`

```typescript
interface ValidationError {
  field: string;
  message: string;
}

class ApiError extends Error {
  details?: ValidationError[];

  constructor(response: { error: string; details?: ValidationError[] }) {
    super(response.error);
    this.details = response.details;
  }
}
```

---

## Localização dos Arquivos

| Camada    | Caminho                                    |
| --------- | ------------------------------------------ |
| Backend   | `backend/src/types/calculator.types.ts`    |
| Frontend  | `frontend/src/types/calculator.types.ts`   |

> **Nota:** Os tipos devem ser mantidos sincronizados entre frontend e backend. Ambos definem as mesmas interfaces.
