import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import cartReducer, { type CartItem } from "./cartSlice";

export const store = configureStore({
  reducer: { cart: cartReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const selectItems = (s: RootState) => s.cart.items;
export const selectCantidadTotal = (s: RootState) =>
  s.cart.items.reduce((acc: number, i: CartItem) => acc + i.cantidad, 0);
export const selectTotal = (s: RootState) =>
  s.cart.items.reduce((acc: number, i: CartItem) => acc + i.cantidad * i.precio, 0);
