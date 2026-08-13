import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cargando, ErrorEstado } from "@/components/Estado";
import { getProducto } from "@/lib/api";
import { formatoPrecio } from "@/lib/format";
import { agregarProducto } from "@/store/cartSlice";
import { useAppDispatch } from "@/store";

export const Route = createFileRoute("/producto/$id")({
  head: () => ({
    meta: [
      { title: "Detalle del producto | PixelForge" },
      {
        name: "description",
        content: "Ficha completa del producto: precio, stock, categoría y descripción detallada.",
      },
      { property: "og:title", content: "Detalle del producto | PixelForge" },
      {
        property: "og:description",
        content: "Precio, stock y descripción del producto en PixelForge.",
      },
    ],
  }),
  component: DetalleProducto,
});

function DetalleProducto() {
  const { id } = Route.useParams();
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["producto", id],
    queryFn: () => getProducto(id),
  });

  if (isLoading) return <Cargando texto="Cargando producto..." />;
  if (isError || !data)
    return (
      <ErrorEstado
        mensaje={(error as Error)?.message ?? "Producto no encontrado"}
        onRetry={() => void refetch()}
      />
    );

  const sinStock = data.stock <= 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        to="/productos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border/70">
          <img
            src={data.imagen}
            alt={data.nombre}
            className="aspect-4/3 w-full object-cover"
          />
        </div>
        <div>
          <Badge variant="secondary">{data.categoria}</Badge>
          <h1 className="mt-3 text-3xl font-bold">{data.nombre}</h1>
          <p className="mt-4 font-display text-4xl font-bold text-primary">
            {formatoPrecio(data.precio)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {sinStock ? "Sin stock disponible" : `${data.stock} unidades en stock`}
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground">{data.descripcion}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              disabled={sinStock}
              onClick={() => {
                dispatch(agregarProducto(data));
                toast.success(`${data.nombre} agregado al carrito`);
              }}
            >
              Agregar al carrito
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/carrito">Ir al carrito</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
