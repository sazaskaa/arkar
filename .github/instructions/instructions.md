---
applyTo: '**'
---

### ### ### ### ### ### ### ###
### INSTRUÇÃO DESCONTINUADA ###
### ### ### ### ### ### ### ###



# Instruções do Projeto Arkar (Copilot)

## Sobre o Projeto

**Arkar** é um comparador que calcula se vale mais a pena **alugar** ou **comprar** um carro, considerando compra à vista e financiada (Tabela Price).

### Stack Tecnológico

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript + CORS
- **Deploy:** Vercel (frontend) + Railway (backend)

---

## Estrutura de Pastas

> **Princípio:** um arquivo faz **uma única coisa bem feita**. Se crescer demais ou acumular responsabilidades, **quebre em arquivos menores**.

### Frontend (`/frontend/src/`)

- **`/components/`**: componentes React **reutilizáveis** e **componentizados ao máximo**.
  - Exemplos: `Button.tsx`, `Input.tsx`, `Card.tsx`, `ResultCard.tsx`
  - Cada componente em seu próprio arquivo
  - Se um componente crescer, quebre em subcomponentes

- **`/services/`**: chamadas à API e integrações externas.
  - Exemplo: `api.ts` (cliente HTTP), `calculator-service.ts` (lógica de comunicação com backend)
  - Um serviço por arquivo

- **`/types/`**: interfaces e tipos TypeScript compartilhados.
  - Exemplo: `Calculator.types.ts`, `api.types.ts`
  - Tipos relacionados agrupados por contexto

- **`/assets/`**: imagens, ícones, fontes e outros recursos estáticos.

- **Arquivos raiz:**
  - `App.tsx`: componente principal e estrutura da aplicação
  - `main.tsx`: ponto de entrada (bootstrap)
  - `index.css`: estilos globais e configuração do Tailwind

### Backend (`/backend/src/`)

- **`/routes/`**: definição das rotas da API.
  - Exemplo: `calculator.routes.ts`
  - Uma rota por contexto/recurso

- **`/services/`**: lógica de negócio e cálculos.
  - Exemplo: `price-calculator.service.ts`, `comparison.service.ts`
  - Cada serviço com uma responsabilidade específica

- **`/types/`**: interfaces e tipos TypeScript.
  - Exemplo: `calculator.types.ts`, `request.types.ts`

- **Arquivo raiz:**
  - `index.ts`: configuração do Express, middlewares e inicialização do servidor

---

## Regras de Componentização

- **Componentize ao máximo** sempre que necessário e possível.
- Componentes devem ser **pequenos**, **focados** e **reutilizáveis**.
- Prefira criar um novo componente a deixar um componente existente crescer demais.
- Exemplo: se um formulário tem muitos campos, crie componentes para grupos de campos.

---

## Responsabilidade Única por Arquivo

- **Cada arquivo faz uma única coisa bem feita.**
- Se um arquivo crescer (>150-200 linhas) ou acumular múltiplas responsabilidades, **divida-o em arquivos menores**.
- Exemplo: se um serviço gerencia múltiplos cálculos, separe cada cálculo em seu próprio arquivo.

---

## Regras de Nomenclatura

- **Componentes React:** `PascalCase` (ex.: `ResultCard.tsx`, `InputField.tsx`)
- **Arquivos de serviço/função:** `kebab-case` ou `camelCase` + sufixo `.service.ts` ou `.util.ts`
  - Exemplo: `calculator.service.ts`, `format-currency.util.ts`
- **Rotas (backend):** `kebab-case` + sufixo `.routes.ts`
  - Exemplo: `calculator.routes.ts`
- **Tipos/Interfaces:** `PascalCase` para tipos, arquivos em `kebab-case` + `.types.ts`
  - Exemplo: `CalculatorInput` em `calculator.types.ts`
- **Funções e variáveis:** `camelCase`
- **Constantes:** `UPPER_SNAKE_CASE` quando necessário
  - Exemplo: `API_BASE_URL`, `MAX_LOAN_PERIOD`

---

## Imports

- **Sempre use imports explícitos** para cada dependência necessária no arquivo.
- **Evite auto-imports** para manter controle total sobre as dependências.
- Organize imports em grupos (bibliotecas externas → imports locais → tipos).

**Exemplo:**

```typescript
// Bibliotecas externas
import React from 'react';
import axios from 'axios';

// Imports locais
import { Button } from './components/Button';
import { calculateLoan } from './services/calculator.service';

// Tipos
import type { CalculatorInput } from './types/calculator.types';
```

---

## Padrões Específicos do Projeto

### Frontend
- Use **Tailwind CSS** para estilização (evite CSS modules ou styled-components).
- Componentes devem receber props tipadas via TypeScript.
- Mantenha lógica de estado e efeitos no componente pai quando possível.

### Backend
- Todas as rotas devem estar em `/routes/`.
- Lógica de negócio e cálculos ficam em `/services/`.
- Validações de entrada devem acontecer nas rotas antes de chamar serviços.
- Use tipos TypeScript para request/response bodies.

### API
- Endpoint principal: `POST /api/calculate`
- Retornar sempre status HTTP apropriados (200, 400, 500).
- Incluir mensagens de erro claras no body da resposta.