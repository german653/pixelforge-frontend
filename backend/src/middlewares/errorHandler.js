export class ApiError extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

export function notFound(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Error de validación",
      detalles: Object.values(err.errors).map((e) => e.message),
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "ID inválido" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: "El registro ya existe (valor duplicado)" });
  }

  res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
}
