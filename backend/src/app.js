import express from "express";
import cors from "cors";
import productoRoutes from "./routes/productoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/productos", productoRoutes);
app.use("/api/usuarios", usuarioRoutes);

app.use(notFound);
app.use(errorHandler);
