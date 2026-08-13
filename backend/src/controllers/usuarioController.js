import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario.js";
import { ApiError } from "../middlewares/errorHandler.js";

const firmarToken = (u) =>
  jwt.sign({ id: u._id, email: u.email, rol: u.rol }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// POST /api/usuarios/registro
export async function registrar(req, res, next) {
  try {
    const { nombre, email, password } = req.body;
    const usuario = await Usuario.create({ nombre, email, password });
    res.status(201).json({
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      token: firmarToken(usuario),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/usuarios/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, "Email y contraseña son obligatorios");
    const usuario = await Usuario.findOne({ email: email.toLowerCase() }).select("+password");
    if (!usuario || !(await usuario.compararPassword(password)))
      throw new ApiError(401, "Credenciales inválidas");
    res.json({
      email: usuario.email,
      rol: usuario.rol,
      token: firmarToken(usuario),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/usuarios
export async function listarUsuarios(req, res, next) {
  try {
    res.json(await Usuario.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
}

// GET /api/usuarios/:id
export async function obtenerUsuario(req, res, next) {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) throw new ApiError(404, "Usuario no encontrado");
    res.json(usuario);
  } catch (err) {
    next(err);
  }
}

// PUT /api/usuarios/:id
export async function actualizarUsuario(req, res, next) {
  try {
    const { nombre, email, rol } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, email, rol },
      { new: true, runValidators: true },
    );
    if (!usuario) throw new ApiError(404, "Usuario no encontrado");
    res.json(usuario);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/usuarios/:id
export async function eliminarUsuario(req, res, next) {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) throw new ApiError(404, "Usuario no encontrado");
    res.json({ ok: true, mensaje: "Usuario eliminado" });
  } catch (err) {
    next(err);
  }
}
