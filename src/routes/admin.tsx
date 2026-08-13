import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUser } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Cargando, ErrorEstado } from "@/components/Estado";
import { formatoPrecio } from "@/lib/format";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  getProductos,
  type Producto,
} from "@/lib/api";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    const user = getUser();
    if (!user || user.rol !== "admin") {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Panel administrativo | PixelForge" },
      {
        name: "description",
        content: "Gestión de productos de PixelForge: alta, edición y baja del catálogo.",
      },
      { property: "og:title", content: "Panel administrativo | PixelForge" },
      { property: "og:description", content: "ABM de productos del ecommerce PixelForge." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type FormState = Omit<Producto, "_id">;

const vacio: FormState = {
  nombre: "",
  precio: 0,
  descripcion: "",
  stock: 0,
  categoria: "",
  imagen: "",
};

function Admin() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  const [form, setForm] = useState<FormState>(vacio);
  const [editando, setEditando] = useState<string | null>(null);
  const [errores, setErrores] = useState<string[]>([]);

  const invalidar = () => {
    void qc.invalidateQueries({ queryKey: ["productos"] });
  };

  const crear = useMutation({
    mutationFn: (d: FormState) => crearProducto(d),
    onSuccess: () => {
      toast.success("Producto creado");
      setForm(vacio);
      invalidar();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const editar = useMutation({
    mutationFn: ({ id, d }: { id: string; d: FormState }) => actualizarProducto(id, d),
    onSuccess: () => {
      toast.success("Producto actualizado");
      setEditando(null);
      setForm(vacio);
      invalidar();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const borrar = useMutation({
    mutationFn: (id: string) => eliminarProducto(id),
    onSuccess: () => {
      toast.success("Producto eliminado");
      invalidar();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function validar(f: FormState) {
    const errs: string[] = [];
    if (f.nombre.trim().length < 3) errs.push("El nombre debe tener al menos 3 caracteres.");
    if (!(f.precio > 0)) errs.push("El precio debe ser mayor a 0.");
    if (f.descripcion.trim().length < 10)
      errs.push("La descripción debe tener al menos 10 caracteres.");
    if (f.stock < 0 || !Number.isInteger(f.stock))
      errs.push("El stock debe ser un entero mayor o igual a 0.");
    if (f.categoria.trim() === "") errs.push("La categoría es obligatoria.");
    return errs;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validar(form);
    setErrores(errs);
    if (errs.length > 0) return;
    const data: FormState = {
      ...form,
      imagen:
        form.imagen.trim() ||
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    };
    if (editando) editar.mutate({ id: editando, d: data });
    else crear.mutate(data);
  }

  const guardando = crear.isPending || editar.isPending;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Panel administrativo</h1>
      <p className="mt-2 text-muted-foreground">Alta, edición y baja de productos del catálogo.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
        <form
          onSubmit={onSubmit}
          className="h-fit space-y-4 rounded-xl border border-border/70 bg-card/60 p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editando ? "Editar producto" : "Nuevo producto"}
            </h2>
            {editando && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Cancelar edición"
                onClick={() => {
                  setEditando(null);
                  setForm(vacio);
                  setErrores([]);
                }}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                type="number"
                min={0}
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Input
              id="categoria"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              placeholder="Juegos, Consolas, Accesorios..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagen">Imagen (URL)</Label>
            <Input
              id="imagen"
              value={form.imagen}
              onChange={(e) => setForm({ ...form, imagen: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              rows={4}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          {errores.length > 0 && (
            <ul className="list-inside list-disc space-y-1 text-sm text-destructive">
              {errores.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}

          <Button type="submit" className="w-full" disabled={guardando}>
            {guardando ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Plus className="mr-2 size-4" />
            )}
            {editando ? "Guardar cambios" : "Crear producto"}
          </Button>
        </form>

        <div className="rounded-xl border border-border/70 bg-card/60 p-5">
          <h2 className="text-lg font-semibold">Catálogo ({data?.length ?? 0})</h2>

          {isLoading && <Cargando />}
          {isError && (
            <ErrorEstado mensaje={(error as Error).message} onRetry={() => void refetch()} />
          )}

          {!isLoading && !isError && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-muted-foreground">
                  <tr className="border-b border-border/70">
                    <th className="py-2 pr-3 font-medium">Producto</th>
                    <th className="py-2 pr-3 font-medium">Categoría</th>
                    <th className="py-2 pr-3 font-medium">Precio</th>
                    <th className="py-2 pr-3 font-medium">Stock</th>
                    <th className="py-2 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(data ?? []).map((p) => (
                    <tr key={p._id} className="border-b border-border/40">
                      <td className="py-2 pr-3">{p.nombre}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{p.categoria}</td>
                      <td className="py-2 pr-3">{formatoPrecio(p.precio)}</td>
                      <td className="py-2 pr-3">{p.stock}</td>
                      <td className="flex gap-1 py-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Editar ${p.nombre}`}
                          onClick={() => {
                            setEditando(p._id);
                            setErrores([]);
                            setForm({
                              nombre: p.nombre,
                              precio: p.precio,
                              descripcion: p.descripcion,
                              stock: p.stock,
                              categoria: p.categoria,
                              imagen: p.imagen,
                            });
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Eliminar ${p.nombre}`}
                          onClick={() => borrar.mutate(p._id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
