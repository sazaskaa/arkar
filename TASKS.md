# TASKS — Arkar: Comparador Aluguel vs Compra de Carro

Legenda de status (marcar durante a execução):

[~] = Tarefa em progreso (sendo executada pelo agente)
[x] = Tarefa concluída
[ ] = Tarefa pendente (não iniciada)

Tarefas organizadas na ordem lógica de execução (passo a passo).

---

## 1. Tipos e Modelos (base compartilhada)

- [x] Criar interfaces e tipos TypeScript no backend (`backend/src/types/calculator.types.ts`) — [specs/tipos_modelos.md](specs/tipos_modelos.md)
- [x] Criar interfaces e tipos TypeScript no frontend (`frontend/src/types/calculator.types.ts`) — [specs/tipos_modelos.md](specs/tipos_modelos.md)

## 2. Lógica de Cálculo (backend)

- [x] Implementar o serviço de cálculo com as fórmulas de compra à vista, financiamento (Price) e aluguel (`backend/src/services/calculator.service.ts`) — [specs/logica_calculo.md](specs/logica_calculo.md)
- [x] Implementar a lógica de recomendação (menor custo) e cálculo de economia (savings) — [specs/logica_calculo.md](specs/logica_calculo.md)

## 3. API Backend (servidor e rotas)

- [x] Configurar o servidor Express com CORS, body parser e health check (`backend/src/index.ts`) — [specs/api_backend.md](specs/api_backend.md)
- [x] Implementar a rota `POST /api/calculate` com validações e tratamento de erros (`backend/src/routes/calculator.routes.ts`) — [specs/api_backend.md](specs/api_backend.md)

## 4. Formulário Frontend

- [x] Criar o componente `CalculatorForm` com campos, validação local, layout responsivo e acessibilidade (`frontend/src/components/CalculatorForm.tsx`) — [specs/formulario_frontend.md](specs/formulario_frontend.md)

## 5. Exibição de Resultados Frontend

- [x] Criar o componente `ResultDisplay` com cards de resultado, destaque da melhor opção, seção de recomendação e formatação monetária (`frontend/src/components/ResultDisplay.tsx`) — [specs/exibicao_resultados.md](specs/exibicao_resultados.md)

## 6. Integração Frontend ↔ Backend

- [x] Criar o serviço de API no frontend com `fetch` e tratamento de erros (`frontend/src/services/api.service.ts`) — [specs/integracao_front_back.md](specs/integracao_front_back.md)
- [x] Implementar o `App.tsx` como orquestrador: estado, handler de submissão, renderização condicional do formulário e resultados — [specs/integracao_front_back.md](specs/integracao_front_back.md)
- [x] Criar arquivo `.env.example` no frontend com `VITE_API_URL` — [specs/integracao_front_back.md](specs/integracao_front_back.md)

## 7. Deploy

- [x] Configurar `.gitignore` na raiz do projeto — [specs/deploy.md](specs/deploy.md)
- [x] Deploy do backend no Railway (configurar root directory, variáveis de ambiente, testar health check) — [specs/deploy.md](specs/deploy.md)
- [x] Deploy do frontend no Vercel (configurar root directory, `VITE_API_URL`, testar integração) — [specs/deploy.md](specs/deploy.md)
- [x] Validar integração em produção (CORS, formulário, cálculo end-to-end) — [specs/deploy.md](specs/deploy.md)
