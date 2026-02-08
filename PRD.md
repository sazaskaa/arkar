# PRD - Comparador Aluguel vs Compra de Carro

## Objetivo

Criar um site chamado "Arkar" que compare se vale mais a pena **alugar** ou **comprar** um carro, considerando compra à vista e financiada (a ideia inicial é pelo menos ter campos tipo valor do carro, valor do aluguel mensal, taxa de juros, prazo do financiamento, que nos ajudem a chegar na conclusão se compensa mais alugar ou comprar um carro).

---

## Stack Tecnológica

| Camada           | Tecnologia                            | Justificativa                                                                                |
| ---------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Frontend**     | React + TypeScript + Vite             | Vite é mais rápido e leve que CRA, TypeScript garante tipagem                                |
| **Estilos**      | CSS + Tailwind (configurado)          | Base pronta para utilitários, mas a UI atual usa CSS customizado                             |
| **Backend**      | Node.js + Express + TypeScript + CORS | API simples e performática, TS para consistência, CORS para permitir requisições do frontend |
| **Deploy Front** | Vercel                                | Gratuito, integração nativa com React                                                        |
| **Deploy Back**  | Railway                               | Gratuito (tier hobby), fácil deploy de Node.js                                               |

---

## Estrutura do Projeto

```
arkar/
├── .git/                      # Historico do repositorio
├── .github/                   # Instrucoes internas e skills do agente
├── .vscode/                   # Preferencias locais do VS Code
├── .gitignore
├── PRD.md
├── TASKS.md                   # Checklist de implementacao (concluido)
├── specs/                     # Especificacoes detalhadas por feature
├── backend/                   # API Express + TypeScript
│   ├── src/
│   │   ├── routes/            # Rotas HTTP (POST /api/calculate)
│   │   ├── services/          # Logica de calculo e recomendacao
│   │   ├── types/             # Tipos e erros compartilhados da API
│   │   └── index.ts           # Bootstrap do servidor + CORS + health check
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
└── frontend/                  # React + Vite + TypeScript
    ├── .env                   # Variaveis locais (nao versionar)
    ├── .env.example           # Template de variaveis para o frontend
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/        # Formulario e exibicao de resultados
    │   ├── services/          # Client HTTP (fetch) para a API
    │   ├── types/             # Tipos TypeScript compartilhados no frontend
    │   ├── App.css
    │   ├── App.tsx
    │   ├── index.css          # Tema visual e layout
    │   └── main.tsx
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── README.md
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

---

## Funcionalidades (MVP)

### Campos de Entrada

| Campo                   | Tipo   | Descrição                                    |
| ----------------------- | ------ | -------------------------------------------- |
| Valor do carro          | number | Preço do veículo (R$)                        |
| Valor do aluguel mensal | number | Custo mensal do aluguel (R$)                 |
| Taxa de juros (a.m.)    | number | Taxa mensal para financiamento (%)           |
| Prazo do financiamento  | number | Quantidade de meses                          |
| Entrada (opcional)      | number | Valor de entrada na compra financiada (R$)   |
| Período de comparação   | number | Meses para comparar (padrão: igual ao prazo) |

### Cálculos (Backend)

1. **Compra à Vista**
   - Custo total = Valor do carro

2. **Compra Financiada (Tabela Price)**
   - Parcela = `(ValorFinanciado × Taxa) / (1 - (1 + Taxa)^-Prazo)`
   - Custo total = Entrada + (Parcela × Prazo)

3. **Aluguel**
   - Custo total = Aluguel mensal × Período de comparação

### Saída

- Custo total de cada opção
- Indicação clara de qual é mais vantajosa
- Diferença de valor entre as opções

---

## API Endpoints

### `POST /api/calculate`

**Request:**

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

**Response:**

```json
{
  "cash": {
    "total": 50000
  },
  "financing": {
    "monthlyPayment": 1180.45,
    "total": 66661.6
  },
  "rental": {
    "total": 96000
  },
  "recommendation": "cash",
  "savings": {
    "vsFinancing": 16661.6,
    "vsRental": 46000
  }
}
```

**Erros de validacao (HTTP 400):**

```json
{
  "error": "Dados de entrada invalidos",
  "details": [
    {
      "field": "carPrice",
      "message": "O valor do carro e obrigatorio e deve ser maior que zero"
    },
    {
      "field": "financingTerm",
      "message": "O prazo do financiamento e obrigatorio e deve ser um inteiro maior que zero"
    }
  ]
}
```

**Erro interno (HTTP 500):**

```json
{
  "error": "Erro interno do servidor"
}
```

---

## Interface (Simples e Funcional)

1. **Formulário** com os campos de entrada
2. **Botão "Calcular"**
3. **Resultado** exibindo:
   - Cards com valor de cada opção
   - Destaque visual na opção mais barata
   - Economia em relação às outras opções

---

## Deploy

| Serviço           | URL (após deploy)                              |
| ----------------- | -----------------------------------------------|
| Frontend (Vercel) | `https://arkar-eight.vercel.app/`              |
| Backend (Railway) | `https://arkar-production.up.railway.app`      |

---

## Status Atual

MVP implementado (frontend, backend e integração). Consulte TASKS.md e specs/ para detalhes técnicos e checklist finalizado.

---

## Comandos para Rodar Local

```bash
# Backend
cd backend
npm install
npm run dev   # Roda em http://localhost:3001

# Frontend
cd frontend
npm install
npm run dev   # Roda em http://localhost:5173
```

### Variaveis de ambiente

- Backend: PORT e FRONTEND_URL (usado em producao para CORS)
- Frontend: VITE_API_URL (URL base do backend)

---

## Decisões Técnicas

- **TypeScript em ambos**: Consistência e segurança de tipos
- **Cálculo no backend**: Demonstra separação de responsabilidades
- **Vite**: Build mais rápido que CRA, menos config
- **Estrutura simples**: Código fácil de entender e navegar
- **Sem banco de dados**: Não é necessário para o escopo
