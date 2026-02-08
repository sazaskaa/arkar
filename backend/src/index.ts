import cors from "cors";
import express from "express";
import calculatorRoutes from "./routes/calculator.routes";

/**
 * Configuração principal do servidor Express.
 * Define CORS para comunicação segura com o frontend, middlewares para parsing JSON e rotas para a API.
 * Separa backend do frontend para escalabilidade e manutenção independente.
 */
const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Configura CORS: permite qualquer origem em dev, ou específica em produção
app.use(
  cors(
    isProduction
      ? { origin: process.env.FRONTEND_URL || "https://arkar.vercel.app" }
      : undefined
  )
);
app.use(express.json());

// Health check básico
app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

// Monta rotas da calculadora sob /api
app.use("/api", calculatorRoutes);

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
