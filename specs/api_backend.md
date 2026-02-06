# Spec: API Backend

## Objetivo
Especificar a estrutura do servidor Express, rotas, validações e tratamento de erros da API.

---

## 1. Servidor Express

### Configuração (`backend/src/index.ts`)

| Item               | Valor                  |
| ------------------ | ---------------------- |
| Porta              | `3001` (ou `PORT` env) |
| CORS               | Habilitado para todas as origens em dev; restrito à URL do Vercel em produção |
| Body Parser        | `express.json()`       |
| Prefixo das rotas  | `/api`                 |

### Middlewares
1. `cors()` — Permitir requisições cross-origin
2. `express.json()` — Parse do body em JSON
3. Rota de health check: `GET /` → `{ status: 'ok' }`

---

## 2. Endpoint de Cálculo

### `POST /api/calculate`

#### Request

**Content-Type:** `application/json`

**Body:**
```json
{
  "carPrice": 50000,
  "monthlyRent": 2000,
  "interestRate": 1.5,
  "financingTerm": 48,
  "downPayment": 10000,
  "comparisonPeriod": 48
}
```

#### Response de Sucesso (200)

```json
{
  "cash": {
    "total": 50000
  },
  "financing": {
    "monthlyPayment": 1175.04,
    "total": 66402.01
  },
  "rental": {
    "total": 96000
  },
  "recommendation": "cash",
  "savings": {
    "vsFinancing": 16402.01,
    "vsRental": 46000
  }
}
```

#### Response de Erro de Validação (400)

```json
{
  "error": "Dados de entrada inválidos",
  "details": [
    { "field": "carPrice", "message": "O valor do carro deve ser maior que zero" },
    { "field": "interestRate", "message": "A taxa de juros deve ser maior que zero" }
  ]
}
```

#### Response de Erro Interno (500)

```json
{
  "error": "Erro interno do servidor"
}
```

---

## 3. Validações

Executadas **antes** de chamar o serviço de cálculo.

| Campo              | Regra                                                | Mensagem de erro                                         |
| ------------------ | ---------------------------------------------------- | -------------------------------------------------------- |
| `carPrice`         | Obrigatório, `number`, `> 0`                         | "O valor do carro é obrigatório e deve ser maior que zero" |
| `monthlyRent`      | Obrigatório, `number`, `> 0`                         | "O valor do aluguel é obrigatório e deve ser maior que zero" |
| `interestRate`     | Obrigatório, `number`, `> 0`                         | "A taxa de juros é obrigatória e deve ser maior que zero" |
| `financingTerm`    | Obrigatório, `number`, inteiro, `> 0`                | "O prazo do financiamento é obrigatório e deve ser um inteiro maior que zero" |
| `downPayment`      | Opcional, se presente: `number`, `>= 0`, `< carPrice` | "A entrada deve ser um número não negativo e menor que o valor do carro" |
| `comparisonPeriod` | Opcional, se presente: `number`, inteiro, `> 0`      | "O período de comparação deve ser um inteiro maior que zero" |

### Comportamento de validação
- Acumular **todos** os erros de validação e retornar em uma única resposta.
- Não executar cálculo se houver qualquer erro de validação.

---

## 4. Estrutura de Arquivos do Backend

```
backend/src/
├── index.ts                           # Configuração do Express, CORS, listen
├── routes/
│   └── calculator.routes.ts           # Rota POST /api/calculate com validação
├── services/
│   └── calculator.service.ts          # Lógica de cálculo (função pura)
└── types/
    └── calculator.types.ts            # Interfaces TypeScript
```

---

## 5. Rota de Cálculo (`backend/src/routes/calculator.routes.ts`)

### Responsabilidades
1. Extrair campos do `req.body`
2. Aplicar valores padrão: `downPayment = 0`, `comparisonPeriod = financingTerm`
3. Validar todos os campos
4. Chamar `calculate(input)` do serviço
5. Retornar resultado com status `200` ou erros com status `400`/`500`

### Fluxo
```
Request → Extração → Defaults → Validação → Cálculo → Response
                                    ↓ (erro)
                              400 + detalhes
```

---

## 6. Scripts npm

| Script     | Comando                              | Descrição              |
| ---------- | ------------------------------------ | ---------------------- |
| `dev`      | `ts-node-dev --respawn src/index.ts` | Dev com hot reload     |
| `build`    | `tsc`                                | Compilar para JS       |
| `start`    | `node dist/index.js`                 | Rodar versão compilada |

---

## 7. Dependências

### Produção
- `express`
- `cors`

### Desenvolvimento
- `typescript`
- `ts-node-dev`
- `@types/express`
- `@types/cors`
