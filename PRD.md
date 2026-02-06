# PRD - Comparador Aluguel vs Compra de Carro

## Objetivo

Criar um site chamado "Arkar" que compare se vale mais a pena **alugar** ou **comprar** um carro, considerando compra à vista e financiada.

---

## Stack Tecnológica

| Camada           | Tecnologia                            | Justificativa                                                                                |
| ---------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Frontend**     | React + TypeScript + Vite             | Vite é mais rápido e leve que CRA, TypeScript garante tipagem                                |
| **Backend**      | Node.js + Express + TypeScript + CORS | API simples e performática, TS para consistência, CORS para permitir requisições do frontend |
| **Deploy Front** | Vercel                                | Gratuito, integração nativa com React                                                        |
| **Deploy Back**  | Railway                               | Gratuito (tier hobby), fácil deploy de Node.js                                               |

---

## Estrutura do Projeto

```
arkar/
├── .git/
├── .gitignore
├── PRD.md
├── frontend/                 # Projeto React + Vite
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # Componentes React (planejado)
│   │   ├── services/         # Chamadas à API (planejado)
│   │   ├── types/            # Tipos TypeScript (planejado)
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── backend/                  # Projeto Express
  ├── src/
  │   ├── routes/           # Rotas da API (planejado)
  │   ├── services/         # Logica de calculo (planejado)
  │   ├── types/            # Tipos TypeScript (planejado)
  │   └── index.ts
  ├── package.json
  ├── package-lock.json
  └── tsconfig.json
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

| Serviço           | URL (após deploy)               |
| ----------------- | ------------------------------- |
| Frontend (Vercel) | `https://[nome].vercel.app`     |
| Backend (Railway) | `https://[nome].up.railway.app` |

---

## Etapas de Desenvolvimento

1. **Setup inicial** - Criar projetos frontend e backend
2. **Backend** - Implementar endpoint de cálculo
3. **Frontend** - Criar formulário e exibição de resultados
4. **Integração** - Conectar front com back
5. **README** - Documentar como rodar local
6. **Deploy** - Publicar em Vercel + Railway

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

---

## Decisões Técnicas

- **TypeScript em ambos**: Consistência e segurança de tipos
- **Cálculo no backend**: Demonstra separação de responsabilidades
- **Vite**: Build mais rápido que CRA, menos config
- **Estrutura simples**: Código fácil de entender e navegar
- **Sem banco de dados**: Não é necessário para o escopo
