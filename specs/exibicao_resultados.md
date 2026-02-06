# Spec: Exibição de Resultados

## Objetivo
Especificar o componente de exibição dos resultados da comparação, incluindo cards, destaque da melhor opção e economia.

---

## 1. Componente: `ResultDisplay`

### Localização
`frontend/src/components/ResultDisplay.tsx`

### Props

```typescript
interface ResultDisplayProps {
  result: CalculationResult;
}
```

### Condição de renderização
- Só é renderizado quando existe um resultado válido (após cálculo bem-sucedido).

---

## 2. Estrutura Visual

### Layout Geral
```
┌─────────────────────────────────────────────┐
│           Resultado da Comparação            │
├─────────┬─────────────┬─────────────────────┤
│  Card   │    Card     │       Card          │
│  À Vista│  Financiado │      Aluguel        │
│  R$ XX  │   R$ XX     │      R$ XX          │
│         │  Parcela:XX │                     │
├─────────┴─────────────┴─────────────────────┤
│          Resumo / Recomendação              │
│  "A melhor opção é: COMPRA À VISTA"         │
│  "Economia de R$ X vs Financiamento"        │
│  "Economia de R$ X vs Aluguel"              │
└─────────────────────────────────────────────┘
```

---

## 3. Cards de Resultado

Cada cenário é exibido em um card individual.

### Card: Compra à Vista

| Elemento       | Conteúdo                     |
| -------------- | ---------------------------- |
| Título         | "Compra à Vista"             |
| Valor total    | `R$ {cash.total}`            |
| Info adicional | —                            |

### Card: Compra Financiada

| Elemento       | Conteúdo                            |
| -------------- | ----------------------------------- |
| Título         | "Compra Financiada"                 |
| Valor total    | `R$ {financing.total}`              |
| Info adicional | `Parcela: R$ {financing.monthlyPayment}/mês` |

### Card: Aluguel

| Elemento       | Conteúdo                     |
| -------------- | ---------------------------- |
| Título         | "Aluguel"                    |
| Valor total    | `R$ {rental.total}`          |
| Info adicional | —                            |

---

## 4. Destaque Visual

### Card recomendado
- O card correspondente ao `recommendation` deve ter **destaque visual**:
  - Borda de cor diferenciada (verde / tema primário)
  - Badge ou tag com texto "Melhor opção"
  - Leve elevação (shadow) maior que os demais

### Cards não recomendados
- Estilo padrão, sem destaque especial.

---

## 5. Seção de Recomendação

Abaixo dos cards, exibir:

1. **Texto principal:** "A melhor opção é: **{nomeOpção}**"
   - `cash` → "Compra à Vista"
   - `financing` → "Compra Financiada"
   - `rental` → "Aluguel"

2. **Economia:**
   - "Você economiza **R$ {savings.vsFinancing}** em relação ao financiamento"
   - "Você economiza **R$ {savings.vsRental}** em relação ao aluguel"
   - Omitir linha se o valor de economia for `0` (ou seja, quando a comparação é contra a própria opção recomendada).

---

## 6. Formatação de Valores

Todos os valores monetários devem ser formatados no padrão brasileiro:

```typescript
// Usar Intl.NumberFormat
new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(valor)
```

**Exemplo:** `50000` → `R$ 50.000,00`

---

## 7. Layout Responsivo

| Breakpoint         | Disposição dos cards |
| ------------------ | -------------------- |
| Desktop (>= 768px) | 3 colunas lado a lado |
| Tablet (>= 480px)  | 2 colunas + 1 abaixo |
| Mobile (< 480px)   | 1 coluna empilhada   |

---

## 8. Estados

### Sem resultado
- Componente não é renderizado.

### Com resultado
- Exibir cards + recomendação.

> **Nota:** O tratamento de erros da API (exibição de mensagens de falha) é responsabilidade do `App.tsx`, conforme definido na spec de integração. O `ResultDisplay` recebe apenas dados de resultado válidos.

---

## 9. Acessibilidade

- Cards devem usar semântica de `<article>` ou `<section>` com `aria-label`.
- O card recomendado deve ter `aria-label` indicando que é a melhor opção.
- Valores monetários devem ser legíveis por leitores de tela.

---

## 10. Estrutura de Arquivos

```
frontend/src/components/
└── ResultDisplay.tsx
```
