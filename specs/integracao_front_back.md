# Spec: Integração Frontend-Backend

## Objetivo
Especificar como o frontend se comunica com a API do backend, incluindo o serviço HTTP, gerenciamento de estado e tratamento de erros.

---

## 1. Serviço de API

### Localização
`frontend/src/services/api.service.ts`

### Configuração Base

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

| Ambiente    | Valor de `VITE_API_URL`                    |
| ----------- | ------------------------------------------ |
| Desenvolvimento | `http://localhost:3001`               |
| Produção    | URL do Railway (ex: `https://arkar.up.railway.app`) |

---

## 2. Função de Cálculo

### Assinatura

```typescript
async function calculateComparison(input: CalculationInput): Promise<CalculationResult>
```

### Implementação esperada

```typescript
async function calculateComparison(input: CalculationInput): Promise<CalculationResult> {
  const response = await fetch(`${API_BASE_URL}/api/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error);
  }

  return response.json();
}
```

### Tratamento de Erros

| Status HTTP | Comportamento                                          |
| ----------- | ------------------------------------------------------ |
| 200         | Retorna `CalculationResult` parseado                   |
| 400         | Lança erro com detalhes de validação (`ApiError`)      |
| 500         | Lança erro genérico                                    |
| Network err | Lança erro de conexão ("Não foi possível conectar ao servidor") |

---

## 3. Componente Principal (`App.tsx`)

### Responsabilidades
1. Gerenciar estado da aplicação (resultado, loading, erro).
2. Renderizar `CalculatorForm` e `ResultDisplay`.
3. Orquestrar a chamada à API.

### Estado

```typescript
const [result, setResult] = useState<CalculationResult | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Fluxo de Dados

```
                    ┌─────────────┐
                    │   App.tsx   │
                    │  (estado)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
     ┌────────▼───────┐   │   ┌────────▼───────┐
     │ CalculatorForm │   │   │ ResultDisplay  │
     │  (entrada)     │   │   │  (saída)       │
     └────────┬───────┘   │   └────────────────┘
              │            │
              │ onSubmit   │
              ▼            │
     ┌─────────────────┐   │
     │  api.ts          │   │
     │  (fetch POST)   │───┘
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │  Backend API    │
     │  POST /api/calc │
     └─────────────────┘
```

### Handler de Submissão

```typescript
async function handleCalculate(input: CalculationInput) {
  setIsLoading(true);
  setError(null);
  try {
    const result = await calculateComparison(input);
    setResult(result);
  } catch (err) {
    setError('Ocorreu um erro ao calcular. Tente novamente.');
    setResult(null);
  } finally {
    setIsLoading(false);
  }
}
```

---

## 4. Variáveis de Ambiente

### Frontend (`.env`)

| Variável        | Descrição                  | Exemplo                              |
| --------------- | -------------------------- | ------------------------------------ |
| `VITE_API_URL`  | URL base da API do backend | `http://localhost:3001`              |

### Arquivo `.env.example`

```env
VITE_API_URL=http://localhost:3001
```

> **Nota:** O arquivo `.env` não deve ser commitado. Apenas `.env.example` vai para o repositório.

---

## 5. CORS no Backend

### Desenvolvimento
```typescript
app.use(cors()); // Aceita qualquer origem
```

### Produção
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://arkar.vercel.app'
}));
```

| Variável de Ambiente | Descrição                    |
| -------------------- | ---------------------------- |
| `FRONTEND_URL`       | URL do frontend em produção  |

---

## 6. Tecnologias e Decisões

| Decisão         | Escolha     | Justificativa                                |
| --------------- | ----------- | -------------------------------------------- |
| HTTP Client     | `fetch`     | Nativo do browser, sem dependência extra      |
| Estado          | `useState`  | Suficiente para a complexidade do MVP         |
| Env vars        | `import.meta.env` | Padrão do Vite                         |

---

## 7. Estrutura de Arquivos Relacionados

```
frontend/src/
├── App.tsx                          # Orquestrador principal
├── services/
│   └── api.service.ts               # Chamadas HTTP ao backend
└── types/
    └── calculator.types.ts          # Tipos compartilhados

backend/src/
└── index.ts                         # Configuração CORS
```
