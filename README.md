# Arkar — Comparador Aluguel vs Compra de Carro

Aplicação web que compara se vale mais a pena **alugar** ou **comprar** um carro (à vista ou financiado), a partir de dados como preço do veículo, aluguel mensal, taxa de juros e prazo do financiamento.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Estilos: CSS + Tailwind

## Requisitos

- Node.js instalado (ambiente atual: 25.2.1)
- npm

## Rodar local

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

O backend sobe em `http://localhost:3001`.

### 2) Frontend

```bash
cd frontend
npm install
```

Copie o arquivo de exemplo de variáveis e ajuste se necessário:

```bash
copy .env.example .env
```

Depois, inicie o frontend:

```bash
npm run dev
```

O frontend sobe em `http://localhost:5173`.

> **Dica:** se você mudar a porta do backend, atualize `VITE_API_URL` no `.env`.

## Variáveis de ambiente

### Frontend

- `VITE_API_URL` — URL base do backend (padrão: `http://localhost:3001`)

### Backend

- `PORT` — porta do servidor (padrão: `3001`)
- `FRONTEND_URL` — usado em produção para configurar o CORS

## API

- `GET /` — retorna `{ "status": "ok" }` (health check)
- `POST /api/calculate` — recebe os dados e retorna o comparativo

Exemplo de request:

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

## Scripts

### Backend

- `npm run dev` — servidor com hot reload
- `npm run build` — gera `dist/`
- `npm run start` — inicia o build em `dist/`

### Frontend

- `npm run dev` — Vite dev server
- `npm run build` — build de produção
- `npm run preview` — preview do build
- `npm run lint` — lint do projeto

## Deploy

- Frontend (Vercel): https://arkar-eight.vercel.app/
- Backend (Railway): https://arkar-production.up.railway.app

## Estrutura do repositório

```
backend/   # API Express + TypeScript
frontend/  # React + Vite + TypeScript
specs/     # especificações detalhadas
```

## Notas

- O frontend se comunica com o backend via `fetch` no endpoint `/api/calculate`.
- Em desenvolvimento, o CORS do backend fica aberto. Em produção, configure `FRONTEND_URL` para restringir a origem permitida.
