import "dotenv/config";
import { conectarDB } from "./config/db.js";
import { Producto } from "./models/Producto.js";
import { Usuario } from "./models/Usuario.js";

const productos = [
  {
    nombre: "Neon Drift 2077",
    precio: 59999,
    descripcion: "Carreras futuristas en una megaciudad lluviosa. Campaña y multijugador online.",
    stock: 14,
    categoria: "Juegos",
  },
  {
    nombre: "Control Pro Wireless",
    precio: 84999,
    descripcion: "Joystick inalámbrico con gatillos hall effect y 40 horas de batería.",
    stock: 32,
    categoria: "Accesorios",
  },
  {
    nombre: "Consola Vortex X",
    precio: 749999,
    descripcion: "Consola 4K 120fps con 1TB SSD, ray tracing y retrocompatibilidad total.",
    stock: 5,
    categoria: "Consolas",
  },
];

await conectarDB();
await Producto.deleteMany({});
await Producto.insertMany(productos);

await Usuario.deleteMany({ email: "admin@pixelforge.dev" });
await Usuario.create({
  nombre: "Admin",
  email: "admin@pixelforge.dev",
  password: "admin123",
  rol: "admin",
});

console.log("Seed completado");
process.exit(0);
