import { useEffect, useRef } from "react";
import { selectItems, useAppDispatch, useAppSelector } from "@/store";
import { hidratarCarrito, type CartItem } from "@/store/cartSlice";

const KEY = "pixelforge_cart";

export function CartPersistence() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const hidratado = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) dispatch(hidratarCarrito(JSON.parse(raw) as CartItem[]));
    } catch {
      localStorage.removeItem(KEY);
    }
    hidratado.current = true;
  }, [dispatch]);

  useEffect(() => {
    if (!hidratado.current) return;
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  return null;
}
