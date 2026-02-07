import cors from "cors";
import express from "express";
import calculatorRoutes from "./routes/calculator.routes";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors(
    isProduction
      ? { origin: process.env.FRONTEND_URL || "https://arkar.vercel.app" }
      : undefined
  )
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", calculatorRoutes);

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
