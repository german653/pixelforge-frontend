import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(new ApiError(401, "No autorizado"));
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new ApiError(401, "Token inválido o expirado"));
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.rol !== "admin") return next(new ApiError(403, "Requiere rol admin"));
  next();
}
