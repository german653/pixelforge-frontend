import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatoPrecio } from "@/lib/format";
import type { Producto } from "@/lib/api";
import { agregarProducto } from "@/store/cartSlice";
import { useAppDispatch } from "@/store";

export function ProductCard({ producto }: { producto: Producto }) {
  const dispatch = useAppDispatch();
  const sinStock = producto.stock <= 0;

  return (
    <Card className="group overflow-hidden border-border/70 bg-card/70 pt-0 transition-transform hover:-translate-y-1 hover:neon-border">
      <Link
        to="/producto/$id"
        params={{ id: producto._id }}
        className="block aspect-4/3 overflow-hidden bg-secondary"
      >
        <img
          src={producto.imagen}
          alt={producto.nombre}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{producto.categoria}</Badge>
          {sinStock ? (
            <span className="text-xs text-destructive">Sin stock</span>
          ) : (
            <span className="text-xs text-muted-foreground">{producto.stock} disponibles</span>
          )}
        </div>
        <h3 className="line-clamp-1 text-base font-semibold">
          <Link to="/producto/$id" params={{ id: producto._id }} className="hover:text-primary">
            {producto.nombre}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{producto.descripcion}</p>
        <p className="font-display text-xl font-bold text-primary">
          {formatoPrecio(producto.precio)}
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          className="flex-1"
          disabled={sinStock}
          onClick={() => {
            dispatch(agregarProducto(producto));
            toast.success(`${producto.nombre} agregado al carrito`);
          }}
        >
          Agregar
        </Button>
        <Button asChild variant="outline">
          <Link to="/producto/$id" params={{ id: producto._id }}>
            Ver
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
