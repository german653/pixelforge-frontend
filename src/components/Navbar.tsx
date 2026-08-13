import { Link, useNavigate } from "@tanstack/react-router";
import { Gamepad2, LogOut, Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { selectCantidadTotal, useAppSelector } from "@/store";
import { cerrarSesion, getUser } from "@/lib/api";

export function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const cantidad = useAppSelector(selectCantidadTotal);
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    cerrarSesion();
    void navigate({ to: "/" });
  }

  const links = [
    { to: "/", label: "Inicio" },
    { to: "/productos", label: "Productos" },
    ...(user?.rol === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <Gamepad2 className="size-6 text-primary" />
          <span className="text-gradient">PIXELFORGE</span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Button asChild variant="ghost" size="sm" className="relative">
            <Link to="/carrito" aria-label="Ver carrito">
              <ShoppingCart className="size-5" />
              {cantidad > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                  {cantidad}
                </span>
              )}
            </Link>
          </Button>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button size="sm" variant="outline" onClick={handleLogout} aria-label="Cerrar sesión">
                <LogOut className="mr-1 size-4" />
                Salir
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link to="/login">Ingresar</Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setAbierto((v) => !v)}
            aria-label="Abrir menú"
          >
            {abierto ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {abierto && (
        <div className="border-t border-border/70 px-4 pb-4 md:hidden">
          {[...links, ...(user ? [] : [{ to: "/login", label: "Ingresar" } as const])].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setAbierto(false)}
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={() => { handleLogout(); setAbierto(false); }}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              Cerrar sesión ({user.email})
            </button>
          )}
        </div>
      )}
    </header>
  );
}
