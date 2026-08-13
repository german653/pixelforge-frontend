import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatoPrecio } from "@/lib/format";
import { selectItems, selectTotal, useAppDispatch, useAppSelector } from "@/store";
import {
  agregarProducto,
  eliminarDelCarrito,
  quitarUnidad,
  vaciarCarrito,
} from "@/store/cartSlice";

export const Route = createFileRoute("/carrito")({
  head: () => ({
    meta: [
      { title: "Tu carrito de compras | PixelForge" },
      {
        name: "description",
        content: "Revisá los productos de tu carrito, ajustá cantidades y confirmá tu compra gamer.",
      },
      { property: "og:title", content: "Tu carrito | PixelForge" },
      { property: "og:description", content: "Revisá y confirmá tu compra en PixelForge." },
    ],
  }),
  component: Carrito,
});

function Carrito() {
  const items = useAppSelector(selectItems);
  const total = useAppSelector(selectTotal);
  const dispatch = useAppDispatch();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Carrito</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border/70 bg-card/60 p-10 text-center">
          <p className="text-muted-foreground">Tu carrito está vacío.</p>
          <Button asChild className="mt-5">
            <Link to="/productos">Explorar productos</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item._id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-border/70 bg-card/60 p-3"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="size-20 rounded-lg object-cover"
                />
                <div className="min-w-40 flex-1">
                  <p className="font-semibold">{item.nombre}</p>
                  <p className="text-sm text-muted-foreground">{formatoPrecio(item.precio)} c/u</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label="Quitar una unidad"
                    onClick={() => dispatch(quitarUnidad(item._id))}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.cantidad}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label="Agregar una unidad"
                    onClick={() =>
                      dispatch(
                        agregarProducto({
                          _id: item._id,
                          nombre: item.nombre,
                          precio: item.precio,
                          imagen: item.imagen,
                          descripcion: "",
                          stock: 99,
                          categoria: "",
                        }),
                      )
                    }
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                <p className="w-28 text-right font-display font-bold text-primary">
                  {formatoPrecio(item.precio * item.cantidad)}
                </p>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Eliminar producto"
                  onClick={() => dispatch(eliminarDelCarrito(item._id))}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-xl border border-border/70 bg-card/60 p-5">
            <h2 className="text-lg font-semibold">Resumen</h2>
            <div className="mt-4 flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatoPrecio(total)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-border/70 pt-4 font-display text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">{formatoPrecio(total)}</span>
            </div>
            <Button
              className="mt-5 w-full"
              onClick={() => toast.success("¡Compra simulada con éxito!")}
            >
              Finalizar compra
            </Button>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => {
                dispatch(vaciarCarrito());
                toast("Carrito vaciado");
              }}
            >
              Vaciar carrito
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
