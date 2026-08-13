import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión | PixelForge" },
      {
        name: "description",
        content: "Ingresá a tu cuenta de PixelForge para ver tus pedidos y acceder al panel admin.",
      },
      { property: "og:title", content: "Iniciar sesión | PixelForge" },
      { property: "og:description", content: "Accedé a tu cuenta de PixelForge." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const user = await login(email, password);
      toast.success(`Bienvenido, ${user.email}`);
      void navigate({ to: user.rol === "admin" ? "/admin" : "/productos" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-3xl font-bold">Iniciar sesión</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Usá un email que empiece con <code className="text-primary">admin</code> para entrar como
        administrador.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-border/70 bg-card/60 p-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@pixelforge.dev"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={cargando}>
          {cargando && <Loader2 className="mr-2 size-4 animate-spin" />}
          Ingresar
        </Button>
      </form>
    </div>
  );
}
