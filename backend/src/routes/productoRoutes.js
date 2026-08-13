import { Router } from "express";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
  obtenerProducto,
} from "../controllers/productoController.js";
// import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/", listarProductos);
router.get("/:id", obtenerProducto);

// Para exigir admin en el ABM, descomentá los middlewares:
router.post("/", /* requireAuth, requireAdmin, */ crearProducto);
router.put("/:id", /* requireAuth, requireAdmin, */ actualizarProducto);
router.delete("/:id", /* requireAuth, requireAdmin, */ eliminarProducto);

export default router;
