import { Router } from "express";
import {
  actualizarUsuario,
  eliminarUsuario,
  listarUsuarios,
  login,
  obtenerUsuario,
  registrar,
} from "../controllers/usuarioController.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/registro", registrar);
router.post("/login", login);

router.get("/", requireAuth, requireAdmin, listarUsuarios);
router.get("/:id", requireAuth, obtenerUsuario);
router.put("/:id", requireAuth, actualizarUsuario);
router.delete("/:id", requireAuth, requireAdmin, eliminarUsuario);

export default router;
