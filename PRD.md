# PRD - Comparador Aluguel vs Compra de Carro

## Objetivo

Criar um site chamado "Arkar" que compare se vale mais a pena **alugar** ou **comprar** um carro, considerando compra à vista e financiada (a ideia inicial é pelo menos ter campos tipo valor do carro, valor do aluguel mensal, taxa de juros, prazo do financiamento, que nos ajudem a chegar na conclusão se compensa mais alugar ou comprar um carro).

---

## Stack Tecnológica

| Camada           | Tecnologia                            | Justificativa                                                                                |
| ---------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Frontend**     | React + TypeScript + Vite             | Vite é mais rápido e leve que CRA, TypeScript garante tipagem                                |
| **Estilos**      | CSS + Tailwind (configurado)          | Base pronta para utilitários, mas a UI usa CSS customizado                                   |
| **Backend**      | Node.js + Express + TypeScript + CORS | API simples e performática, TS para consistência, CORS para permitir requisições do frontend |
| **PDF Export**   | html2canvas + jsPDF                   | Geração de relatório em PDF a partir do resultado                                            |
| **Gráficos**     | Recharts                              | Visualização de evolução de custos acumulados com LineChart responsivo                       |
| **UI Icons**     | Lucide React                          | Ícones consistentes para inputs e feedbacks                                                  |
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
│   ├── openapi.yaml           # Especificacao OpenAPI (Swagger)
│   ├── dist/                  # Build gerado
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
    ├── public/                # Assets estaticos (logo, etc)
    ├── dist/                  # Build gerado
    ├── src/
    │   ├── assets/
    │   ├── components/        # Formulario, resultados, PDF, secoes de conteudo e grafico
    │   ├── hooks/             # Hooks customizados (tema, PDF, validacao, dados de grafico, etc)
    │   ├── services/          # Client HTTP (fetch) para a API
    │   ├── types/             # Tipos TypeScript compartilhados no frontend
    │   ├── utils/             # Formatadores e helpers
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

### Extras implementados

- **Gráfico de evolução de custos**: LineChart responsivo mostrando a acumulação de custos mês a mês para as três opções (Aluguel, Compra à Vista, Financiamento), com eixo X inteligente (intervalos automáticos: 1/3/6/12 meses conforme o período), tooltip customizado, suporte a dark mode e inclusão no relatório PDF
- Exportação de relatório em PDF (resultado + inputs + gráfico)
- Tema claro/escuro com persistência local
- Overlay de resultado com fechamento por clique/ESC, rolagem interna para acessar todo o conteúdo
- Seção informativa com metodologia e FAQ

---

## API Endpoints

### `GET /`

Health check do backend.

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

### `GET /docs`

Swagger UI para documentação interativa (OpenAPI).

---

## Interface (Atual)

1. **Formulário** com os campos de entrada e validações locais
2. **Botão "Calcular"** com estado de carregamento
3. **Resultado em overlay modal** exibindo:
  - Cards com valor de cada opção
  - Destaque visual na opção mais barata
  - Gráfico de evolução de custos acumulados (LineChart)
  - Economia em relação às outras opções
  - Exportação de relatório em PDF (com gráfico incluído)
4. **Seção informativa** com metodologia e FAQ
5. **Alternância de tema** claro/escuro

---

## Deploy

| Serviço           | URL (após deploy)                              |
| ----------------- | -----------------------------------------------|
| Frontend (Vercel) | `https://arkar-eight.vercel.app/`              |
| Backend (Railway) | `https://arkar-production.up.railway.app`      |

---

## Status Atual

MVP implementado (frontend, backend e integração), com refinamentos de UI, exportação em PDF, tema claro/escuro e gráfico interativo de evolução de custos. Consulte TASKS.md e specs/ para detalhes técnicos e checklist finalizado.

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

### Variáveis de ambiente

- Backend: PORT e FRONTEND_URL (usado em produção para CORS)
- Frontend: VITE_API_URL (URL base do backend)

---

## Decisões Técnicas

- **TypeScript em ambos**: Consistência e segurança de tipos
- **Cálculo no backend**: Demonstra separação de responsabilidades
- **Vite**: Build mais rápido que CRA, menos config
- **Recharts para gráfico**: Biblioteca leve e responsiva, renderização SVG capturável em PDF
- **Hook `useChartData`**: Separação clara entre lógica de geração de dados e componente de visualização
- **Estrutura simples**: Código fácil de entender e navegar
- **Sem banco de dados**: Não é necessário para o escopo
