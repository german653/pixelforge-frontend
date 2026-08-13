import { Producto } from "../models/Producto.js";
import { ApiError } from "../middlewares/errorHandler.js";

// GET /api/productos?buscar=&categoria=
export async function listarProductos(req, res, next) {
  try {
    const { buscar, categoria } = req.query;
    const filtro = {};
    if (categoria) filtro.categoria = categoria;
    if (buscar) filtro.nombre = { $regex: buscar, $options: "i" };
    const productos = await Producto.find(filtro).sort({ createdAt: -1 });
    res.json(productos);
  } catch (err) {
    next(err);
  }
}

// GET /api/productos/:id
export async function obtenerProducto(req, res, next) {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) throw new ApiError(404, "Producto no encontrado");
    res.json(producto);
  } catch (err) {
    next(err);
  }
}

// POST /api/productos
export async function crearProducto(req, res, next) {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (err) {
    next(err);
  }
}

// PUT /api/productos/:id
export async function actualizarProducto(req, res, next) {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!producto) throw new ApiError(404, "Producto no encontrado");
    res.json(producto);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/productos/:id
export async function eliminarProducto(req, res, next) {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) throw new ApiError(404, "Producto no encontrado");
    res.json({ ok: true, mensaje: "Producto eliminado" });
  } catch (err) {
    next(err);
  }
}
