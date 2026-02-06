import cors from "cors";
import express from "express";

const app = express();
app.use(cors());
app.use(express.json());

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
