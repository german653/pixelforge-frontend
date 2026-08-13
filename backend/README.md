# PixelForge — Backend (Express + MongoDB + Mongoose)

Este es el código del **repositorio backend**. Copialo a un repo aparte en GitHub
(por ejemplo `pixelforge-backend`), tal como pide la consigna de dos repositorios.

## Instalación

```bash
npm install
cp .env.example .env   # completá MONGO_URI y JWT_SECRET
npm run seed           # carga productos y un usuario admin de ejemplo
npm run dev            # http://localhost:4000
```

Usuario admin del seed: `admin@pixelforge.dev` / `admin123`.

## Estructura

```
src/
  server.js               arranque del servidor
  app.js                  configuración de Express y montaje de rutas
  config/db.js            conexión a MongoDB con Mongoose
  models/Producto.js      schema con validaciones (nombre, precio, descripcion, stock, categoria)
  models/Usuario.js       schema de usuario + hash de password + roles
  controllers/            lógica de cada endpoint
  routes/                 rutas separadas por recurso
  middlewares/            manejo de errores y autenticación JWT
```

## Endpoints

### Productos (`/api/productos`)
| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/` | Lista productos. Query: `?buscar=texto&categoria=Juegos` |
| GET | `/:id` | Detalle de un producto |
| POST | `/` | Crea un producto |
| PUT | `/:id` | Actualiza un producto |
| DELETE | `/:id` | Elimina un producto |

### Usuarios (`/api/usuarios`)
| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/registro` | Registro de usuario (devuelve token JWT) |
| POST | `/login` | Login (devuelve token JWT) |
| GET | `/` | Lista usuarios (admin) |
| GET | `/:id` | Detalle (autenticado) |
| PUT | `/:id` | Actualiza (autenticado) |
| DELETE | `/:id` | Elimina (admin) |

## Manejo de errores

`middlewares/errorHandler.js` centraliza todo: errores de validación de Mongoose
(400 con la lista de mensajes), `CastError` de ID inválido (400), duplicados (409),
404 de ruta inexistente y 500 genérico.

## Conectar el frontend

En el repo del frontend creá un `.env` con:

```
VITE_API_URL=http://localhost:4000/api
```

`src/lib/api.ts` detecta esa variable y deja de usar el catálogo mock para
consumir esta API real.
