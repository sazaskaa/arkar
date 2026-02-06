# Spec: Deploy

## Objetivo
Especificar a configuração de deploy do frontend (Vercel) e backend (Railway), incluindo variáveis de ambiente, scripts de build e URLs.

---

## 1. Frontend — Vercel

### Plataforma
[Vercel](https://vercel.com) — Tier gratuito (Hobby).

### Configuração do Projeto

| Item              | Valor                    |
| ----------------- | ------------------------ |
| Framework Preset  | Vite                     |
| Root Directory    | `frontend`               |
| Build Command     | `npm run build`          |
| Output Directory  | `dist`                   |
| Install Command   | `npm install`            |
| Node.js Version   | 18.x ou superior         |

### Variáveis de Ambiente (Vercel Dashboard)

| Variável        | Valor                                      | Ambiente   |
| --------------- | ------------------------------------------ | ---------- |
| `VITE_API_URL`  | URL do backend no Railway (definida após deploy do back) | Production |

### URL Esperada
```
https://arkar.vercel.app
```
> O nome exato depende da disponibilidade no Vercel.

### Deploy Automático
- Conectar repositório GitHub ao Vercel.
- Deploys automáticos em push para `main`.
- Preview deploys em pull requests.

---

## 2. Backend — Railway

### Plataforma
[Railway](https://railway.app) — Tier gratuito (Hobby).

### Configuração do Projeto

| Item              | Valor                    |
| ----------------- | ------------------------ |
| Root Directory    | `backend`                |
| Build Command     | `npm run build`          |
| Start Command     | `npm start`              |
| Node.js Version   | 18.x ou superior         |

### Variáveis de Ambiente (Railway Dashboard)

| Variável        | Valor                              | Descrição                     |
| --------------- | ---------------------------------- | ----------------------------- |
| `PORT`          | Configurado automaticamente pelo Railway | Porta do servidor          |
| `FRONTEND_URL`  | `https://arkar.vercel.app`         | URL do frontend para CORS     |
| `NODE_ENV`      | `production`                       | Ambiente de execução          |

### URL Esperada
```
https://arkar.up.railway.app
```
> O nome exato depende da disponibilidade no Railway.

### Deploy Automático
- Conectar repositório GitHub ao Railway.
- Deploys automáticos em push para `main`.

---

## 3. Scripts de Build

### Backend (`backend/package.json`)

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### Frontend (`frontend/package.json`)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

---

## 4. Arquivo `tsconfig.json` do Backend

Garantir que o `outDir` aponta para `dist`:

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

---

## 5. Ordem de Deploy

1. **Backend primeiro** (Railway)
   - Deploy do backend.
   - Obter a URL pública (ex: `https://arkar.up.railway.app`).
   - Configurar `FRONTEND_URL` com a URL do Vercel.

2. **Frontend segundo** (Vercel)
   - Configurar `VITE_API_URL` com a URL do Railway.
   - Deploy do frontend.

3. **Atualizar CORS** (se necessário)
   - Garantir que `FRONTEND_URL` no Railway aponta para a URL correta do Vercel.

---

## 6. Checklist de Deploy

### Backend (Railway)
- [ ] Repositório conectado ao Railway
- [ ] Root directory configurado como `backend`
- [ ] Variável `FRONTEND_URL` configurada
- [ ] Build e start funcionando
- [ ] Endpoint `GET /` retornando `{ status: 'ok' }`
- [ ] Endpoint `POST /api/calculate` funcionando

### Frontend (Vercel)
- [ ] Repositório conectado ao Vercel
- [ ] Root directory configurado como `frontend`
- [ ] Variável `VITE_API_URL` configurada com URL do Railway
- [ ] Build sem erros
- [ ] Site acessível e funcional
- [ ] Comunicação com backend operando (sem erros CORS)

---

## 7. Monitoramento Básico

| Item                    | Como verificar                           |
| ----------------------- | ---------------------------------------- |
| Backend online          | `GET {RAILWAY_URL}/` → `{ status: 'ok' }` |
| Frontend online         | Acessar URL do Vercel no browser          |
| Integração funcionando  | Preencher formulário e calcular          |
| CORS configurado        | Console do browser sem erros de CORS      |

---

## 8. `.gitignore`

Garantir que os seguintes itens estão no `.gitignore` da raiz:

```gitignore
# Dependências
node_modules/

# Build
dist/

# Env
.env
.env.local

# OS
.DS_Store
Thumbs.db
```
