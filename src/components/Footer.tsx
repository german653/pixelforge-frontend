import { Link } from "@tanstack/react-router";
import { Gamepad2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display font-bold">
            <Gamepad2 className="size-5 text-primary" />
            <span className="text-gradient">PIXELFORGE</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Tienda de videojuegos, consolas y accesorios. Proyecto académico full stack.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Navegación</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/productos" className="hover:text-primary">
                Productos
              </Link>
            </li>
            <li>
              <Link to="/carrito" className="hover:text-primary">
                Carrito
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-primary">
                Panel admin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Contacto</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            hola@pixelforge.dev
            <br />
            Buenos Aires, Argentina
          </p>
        </div>
      </div>
      <div className="border-t border-border/70 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PixelForge. Todos los derechos reservados.
      </div>
    </footer>
  );
}
