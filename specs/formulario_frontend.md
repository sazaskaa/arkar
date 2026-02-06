# Spec: Formulário Frontend

## Objetivo
Especificar o componente de formulário de entrada de dados para a comparação aluguel vs compra.

---

## 1. Componente: `CalculatorForm`

### Localização
`frontend/src/components/CalculatorForm.tsx`

### Props

```typescript
interface CalculatorFormProps {
  onSubmit: (data: CalculationInput) => void;
  isLoading: boolean;
}
```

---

## 2. Campos do Formulário

| Campo              | Label                      | Tipo Input      | Placeholder     | Obrigatório | Valor Padrão |
| ------------------ | -------------------------- | --------------- | --------------- | ----------- | ------------ |
| `carPrice`         | Valor do carro (R$)       | `number`        | "Ex: 50000"     | Sim         | —            |
| `monthlyRent`      | Aluguel mensal (R$)       | `number`        | "Ex: 2000"      | Sim         | —            |
| `interestRate`     | Taxa de juros (% a.m.)    | `number` (step=0.01) | "Ex: 1.5"  | Sim         | —            |
| `financingTerm`    | Prazo do financiamento (meses) | `number`   | "Ex: 48"        | Sim         | —            |
| `downPayment`      | Entrada (R$)              | `number`        | "Ex: 10000"     | Não         | 0            |
| `comparisonPeriod` | Período de comparação (meses) | `number`    | "Ex: 48"        | Não         | = `financingTerm` |

---

## 3. Validação no Frontend

Validação local antes de enviar para a API. Exibir mensagens inline abaixo de cada campo.

| Campo              | Regra                                    | Mensagem                                    |
| ------------------ | ---------------------------------------- | ------------------------------------------- |
| `carPrice`         | Preenchido e > 0                         | "Informe um valor maior que zero"           |
| `monthlyRent`      | Preenchido e > 0                         | "Informe um valor maior que zero"           |
| `interestRate`     | Preenchido e > 0                         | "Informe uma taxa maior que zero"           |
| `financingTerm`    | Preenchido, inteiro e > 0               | "Informe um prazo válido em meses"          |
| `downPayment`      | Se preenchido: >= 0 e < `carPrice`      | "A entrada deve ser menor que o valor do carro" |
| `comparisonPeriod` | Se preenchido: inteiro e > 0            | "Informe um período válido em meses"        |

### Comportamento
- Validação ocorre no `onSubmit` (não em tempo real, para não ser intrusivo).
- Campos com erro recebem borda vermelha + mensagem abaixo.
- Corrigir o campo remove o erro ao submeter novamente.

---

## 4. Estado Interno

```typescript
// Estado do formulário
interface FormState {
  carPrice: string;
  monthlyRent: string;
  interestRate: string;
  financingTerm: string;
  downPayment: string;
  comparisonPeriod: string;
}

// Estado dos erros
interface FormErrors {
  carPrice?: string;
  monthlyRent?: string;
  interestRate?: string;
  financingTerm?: string;
  downPayment?: string;
  comparisonPeriod?: string;
}
```

> **Nota:** Os valores do formulário são mantidos como `string` internamente (vindo dos inputs) e convertidos para `number` na submissão.

---

## 5. Botão de Submissão

| Propriedade | Valor                        |
| ----------- | ---------------------------- |
| Texto       | "Calcular"                   |
| Texto loading | "Calculando..."            |
| Tipo        | `submit`                     |
| Desabilitado | Quando `isLoading === true` |

---

## 6. Layout

- Formulário organizado em grid responsivo:
  - **Desktop (>= 768px):** 2 colunas
  - **Mobile (< 768px):** 1 coluna
- Campos opcionais devem ter label com indicação "(opcional)".
- Botão "Calcular" ocupa a largura total abaixo dos campos.

---

## 7. Acessibilidade

- Todos os inputs devem ter `<label>` associado via `htmlFor`.
- Mensagens de erro devem usar `role="alert"`.
- Inputs com erro devem ter `aria-invalid="true"`.
- O formulário deve ser navegável por teclado (Tab/Shift+Tab).

---

## 8. Estrutura de Arquivos

```
frontend/src/components/
└── CalculatorForm.tsx
```
