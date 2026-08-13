import "dotenv/config";
import { app } from "./app.js";
import { conectarDB } from "./config/db.js";

const PORT = process.env.PORT || 4000;

conectarDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("No se pudo conectar a MongoDB:", err.message);
    process.exit(1);
  });
