// Capa de datos del frontend.
// Si definís VITE_API_URL (por ej. http://localhost:4000/api) apunta al backend
// Express + MongoDB; si no, usa el catálogo mock para poder trabajar sin servidor.

export type Producto = {
  _id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  categoria: string;
  imagen: string;
};

const API_URL = import.meta.env["VITE_API_URL"] as string | undefined;

const MOCK: Producto[] = [
  {
    _id: "1",
    nombre: "Neon Drift 2077",
    precio: 59999,
    descripcion:
      "Carreras futuristas en una megaciudad lluviosa. Modo campaña, multijugador online y soporte para volante.",
    stock: 14,
    categoria: "Juegos",
    imagen:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "2",
    nombre: "Control Pro Wireless",
    precio: 84999,
    descripcion:
      "Joystick inalámbrico con gatillos hall effect, vibración háptica y 40 horas de batería.",
    stock: 32,
    categoria: "Accesorios",
    imagen:
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "3",
    nombre: "Consola Vortex X",
    precio: 749999,
    descripcion: "Consola 4K 120fps con 1TB SSD, ray tracing y retrocompatibilidad total.",
    stock: 5,
    categoria: "Consolas",
    imagen:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "4",
    nombre: "Auriculares Echo 7.1",
    precio: 119999,
    descripcion: "Sonido envolvente 7.1, micrófono con cancelación de ruido y almohadillas memory foam.",
    stock: 21,
    categoria: "Accesorios",
    imagen:
      "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "5",
    nombre: "Dungeon of Ash",
    precio: 34999,
    descripcion: "Roguelike pixel art con generación procedural y más de 200 objetos.",
    stock: 0,
    categoria: "Juegos",
    imagen:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "6",
    nombre: "Teclado Mecánico Raid TKL",
    precio: 98999,
    descripcion: "Switches lineales, RGB por tecla, chasis de aluminio y cable USB-C desmontable.",
    stock: 11,
    categoria: "Accesorios",
    imagen:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "7",
    nombre: "Silla Gamer Apex",
    precio: 289999,
    descripcion: "Ergonómica, reclinable 165°, soporte lumbar y apoyabrazos 4D.",
    stock: 7,
    categoria: "Setup",
    imagen:
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "8",
    nombre: "Star Colony: Frontier",
    precio: 44999,
    descripcion: "Estrategia espacial por turnos con campañas cooperativas de hasta 4 jugadores.",
    stock: 18,
    categoria: "Juegos",
    imagen:
      "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=800&q=80",
  },
];

let memoria: Producto[] = [...MOCK];

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export function getToken(): string | null {
  return localStorage.getItem("pixelforge_token");
}

export function getUser(): { email: string; rol: string } | null {
  const raw = localStorage.getItem("pixelforge_user");
  return raw ? (JSON.parse(raw) as { email: string; rol: string }) : null;
}

export function cerrarSesion() {
  localStorage.removeItem("pixelforge_token");
  localStorage.removeItem("pixelforge_user");
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...init,
  });
  if (!res.ok) {
    const texto = await res.text();
    throw new Error(`Error ${res.status}: ${texto || res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function getProductos(): Promise<Producto[]> {
  if (API_URL) return request<Producto[]>("/productos");
  await delay();
  return [...memoria];
}

export async function getProducto(id: string): Promise<Producto> {
  if (API_URL) return request<Producto>(`/productos/${id}`);
  await delay();
  const p = memoria.find((x) => x._id === id);
  if (!p) throw new Error("Producto no encontrado");
  return p;
}

export async function crearProducto(data: Omit<Producto, "_id">): Promise<Producto> {
  if (API_URL) return request<Producto>("/productos", { method: "POST", body: JSON.stringify(data) });
  await delay(200);
  const nuevo: Producto = { ...data, _id: crypto.randomUUID() };
  memoria = [nuevo, ...memoria];
  return nuevo;
}

export async function actualizarProducto(id: string, data: Partial<Producto>): Promise<Producto> {
  if (API_URL)
    return request<Producto>(`/productos/${id}`, { method: "PUT", body: JSON.stringify(data) });
  await delay(200);
  memoria = memoria.map((p) => (p._id === id ? { ...p, ...data } : p));
  const p = memoria.find((x) => x._id === id);
  if (!p) throw new Error("Producto no encontrado");
  return p;
}

export async function eliminarProducto(id: string): Promise<{ ok: true }> {
  if (API_URL) return request<{ ok: true }>(`/productos/${id}`, { method: "DELETE" });
  await delay(200);
  memoria = memoria.filter((p) => p._id !== id);
  return { ok: true };
}

export async function login(email: string, password: string): Promise<{ email: string; rol: string }> {
  if (API_URL) {
    const data = await request<{ email: string; rol: string; token: string }>("/usuarios/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("pixelforge_token", data.token);
    localStorage.setItem("pixelforge_user", JSON.stringify({ email: data.email, rol: data.rol }));
    return { email: data.email, rol: data.rol };
  }
  await delay(400);
  if (!email.includes("@") || password.length < 6) throw new Error("Credenciales inválidas");
  return { email, rol: email.startsWith("admin") ? "admin" : "cliente" };
}
