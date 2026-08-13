import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Producto } from "@/lib/api";

export type CartItem = {
  _id: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
};

type CartState = { items: CartItem[] };

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hidratarCarrito(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    agregarProducto(state, action: PayloadAction<Producto>) {
      const p = action.payload;
      const existente = state.items.find((i) => i._id === p._id);
      if (existente) {
        existente.cantidad += 1;
      } else {
        state.items.push({
          _id: p._id,
          nombre: p.nombre,
          precio: p.precio,
          imagen: p.imagen,
          cantidad: 1,
        });
      }
    },
    quitarUnidad(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i._id === action.payload);
      if (!item) return;
      item.cantidad -= 1;
      if (item.cantidad <= 0) state.items = state.items.filter((i) => i._id !== action.payload);
    },
    eliminarDelCarrito(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    vaciarCarrito(state) {
      state.items = [];
    },
  },
});

export const {
  hidratarCarrito,
  agregarProducto,
  quitarUnidad,
  eliminarDelCarrito,
  vaciarCarrito,
} = cartSlice.actions;

export default cartSlice.reducer;
