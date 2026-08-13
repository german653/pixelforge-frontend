import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Rocket, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Cargando, ErrorEstado } from "@/components/Estado";
import { getProductos } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PixelForge — Tienda de videojuegos, consolas y accesorios" },
      {
        name: "description",
        content:
          "Ecommerce gamer: juegos, consolas y accesorios con envío a todo el país. Buscá, compará y comprá en PixelForge.",
      },
      { property: "og:title", content: "PixelForge — Tienda gamer online" },
      {
        property: "og:description",
        content: "Juegos, consolas y accesorios con los mejores precios.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  const destacados = (data ?? []).slice(0, 4);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-primary/40 px-3 py-1 text-xs uppercase tracking-widest text-primary">
              Nuevo drop 2026
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Tu próximo <span className="text-gradient">nivel</span> empieza acá
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Juegos, consolas y periféricos seleccionados por gamers. Stock real, envíos rápidos y
              precios sin vueltas.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/productos">Ver catálogo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/carrito">Mi carrito</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl neon-border">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80"
                alt="Setup gamer con luces de neón"
                className="aspect-4/3 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3">
        {[
          { icon: Truck, t: "Envío en 48hs", d: "A todo el país" },
          { icon: ShieldCheck, t: "Compra protegida", d: "Garantía de 12 meses" },
          { icon: Rocket, t: "Preventas", d: "Reservá antes del lanzamiento" },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-xl border border-border/70 bg-card/60 p-4">
            <Icon className="size-5 text-accent" />
            <p className="mt-2 font-semibold">{t}</p>
            <p className="text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Destacados</h2>
          <Link to="/productos" className="text-sm text-primary hover:underline">
            Ver todos
          </Link>
        </div>

        {isLoading && <Cargando texto="Cargando productos..." />}
        {isError && (
          <ErrorEstado mensaje={(error as Error).message} onRetry={() => void refetch()} />
        )}
        {!isLoading && !isError && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destacados.map((p) => (
              <ProductCard key={p._id} producto={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
