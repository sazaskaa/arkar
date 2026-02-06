# Spec: Lógica de Cálculo

## Objetivo
Especificar as fórmulas e regras de negócio para os três cenários de comparação: compra à vista, compra financiada e aluguel.

---

## 1. Compra à Vista

### Fórmula
```
custoTotal = carPrice
```

### Regras
- O custo total é simplesmente o valor do carro.
- Não há juros nem parcelas.

### Exemplo
| Entrada     | Valor  |
| ----------- | ------ |
| `carPrice`  | 50.000 |
| **Total**   | **50.000** |

---

## 2. Compra Financiada (Tabela Price)

### Fórmula da Parcela (Sistema Price)
```
valorFinanciado = carPrice - downPayment

parcela = (valorFinanciado × taxaMensal) / (1 - (1 + taxaMensal)^(-prazo))
```

Onde:
- `taxaMensal` = `interestRate / 100` (converter percentual para decimal)
- `prazo` = `financingTerm` (em meses)

### Fórmula do Custo Total
```
custoTotal = downPayment + (parcela × prazo)
```

### Regras
- Se `downPayment` não for informado, considerar `0`.
- A taxa de juros é recebida em **percentual** (ex: `1.5` = 1,5% a.m.) e deve ser convertida para decimal (`0.015`).
- A parcela deve ser arredondada para **2 casas decimais**.
- O custo total inclui a entrada + todas as parcelas.

### Exemplo
| Entrada          | Valor    |
| ---------------- | -------- |
| `carPrice`       | 50.000   |
| `downPayment`    | 10.000   |
| `interestRate`   | 1,5%     |
| `financingTerm`  | 48 meses |

**Cálculo:**
```
valorFinanciado = 50.000 - 10.000 = 40.000
taxaMensal = 1.5 / 100 = 0.015
parcela = (40.000 × 0.015) / (1 - (1 + 0.015)^(-48))
parcela = 600 / (1 - (1.015)^(-48))
parcela = 600 / (1 - 0.4894)
parcela = 600 / 0.5106
parcela ≈ 1.175,04

custoTotal = 10.000 + (1.175,04 × 48) = 10.000 + 56.402,01 = 66.402,01
```

---

## 3. Aluguel

### Fórmula
```
custoTotal = monthlyRent × comparisonPeriod
```

### Regras
- Se `comparisonPeriod` não for informado, usar o valor de `financingTerm`.
- O cálculo é uma multiplicação simples.

### Exemplo
| Entrada            | Valor    |
| ------------------ | -------- |
| `monthlyRent`      | 2.000    |
| `comparisonPeriod` | 48 meses |

**Cálculo:**
```
custoTotal = 2.000 × 48 = 96.000
```

---

## 4. Recomendação

### Lógica
1. Comparar os três custos totais: `cash.total`, `financing.total`, `rental.total`.
2. A opção com o **menor custo total** é a recomendada.
3. O campo `recommendation` deve conter `'cash'`, `'financing'` ou `'rental'`.

### Regra de desempate
- Em caso de empate exato entre valores, priorizar na seguinte ordem: `cash` > `financing` > `rental`.

---

## 5. Economia (Savings)

### Fórmula
```
menorCusto = min(cash.total, financing.total, rental.total)

savings.vsFinancing = financing.total - menorCusto
savings.vsRental = rental.total - menorCusto
```

### Regras
- `savings` sempre mostra quanto se economiza **em relação ao financiamento** e **em relação ao aluguel**.
- Valores devem ser arredondados para 2 casas decimais.
- Se a opção recomendada for financiamento, `vsFinancing` será `0`.
- Se a opção recomendada for aluguel, `vsRental` será `0`.

---

## 6. Arredondamento

Todos os valores monetários na resposta devem ser arredondados para **2 casas decimais** usando `Math.round(valor * 100) / 100`.

---

## 7. Localização do Serviço

| Arquivo                                      | Responsabilidade                 |
| -------------------------------------------- | -------------------------------- |
| `backend/src/services/calculator.service.ts`  | Implementação de todas as fórmulas |

---

## 8. Assinatura da Função Principal

```typescript
function calculate(input: CalculationInput): CalculationResult
```

A função deve ser **pura** (sem efeitos colaterais), recebendo os dados de entrada e retornando o resultado completo.
