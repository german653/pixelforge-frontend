import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Cargando, ErrorEstado } from "@/components/Estado";
import { getProductos } from "@/lib/api";

export const Route = createFileRoute("/productos")({
  head: () => ({
    meta: [
      { title: "Catálogo de productos gamer | PixelForge" },
      {
        name: "description",
        content:
          "Explorá el catálogo completo de PixelForge: juegos, consolas, accesorios y setup. Buscador y filtros por categoría.",
      },
      { property: "og:title", content: "Catálogo de productos gamer | PixelForge" },
      {
        property: "og:description",
        content: "Buscá entre juegos, consolas y accesorios con filtros por categoría.",
      },
    ],
  }),
  component: Productos,
});

function Productos() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const categorias = useMemo(
    () => ["Todas", ...Array.from(new Set((data ?? []).map((p) => p.categoria)))],
    [data],
  );

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return (data ?? []).filter(
      (p) =>
        (categoria === "Todas" || p.categoria === categoria) &&
        (q === "" ||
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q)),
    );
  }, [data, busqueda, categoria]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Productos</h1>
      <p className="mt-2 text-muted-foreground">Encontrá tu próximo juego o upgrade de setup.</p>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="rounded-xl border border-border/70 bg-card/60 p-4">
            <p className="text-sm font-semibold">Categorías</p>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
              {categorias.map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={c === categoria ? "default" : "outline"}
                  onClick={() => setCategoria(c)}
                  className="lg:justify-start"
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar productos..."
              className="pl-9"
              aria-label="Buscar productos"
            />
          </div>

          {isLoading && <Cargando />}
          {isError && (
            <ErrorEstado mensaje={(error as Error).message} onRetry={() => void refetch()} />
          )}
          {!isLoading && !isError && filtrados.length === 0 && (
            <p className="py-20 text-center text-muted-foreground">
              No encontramos productos para “{busqueda}”.
            </p>
          )}
          {!isLoading && !isError && filtrados.length > 0 && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtrados.map((p) => (
                <ProductCard key={p._id} producto={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
