import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Producto } from "@/lib/catalog";

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  add: (p: Producto, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "electrotecno_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: CartCtx["add"] = (p, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((it) => it.producto.id === p.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], cantidad: copy[i].cantidad + qty };
        return copy;
      }
      return [...prev, { producto: p, cantidad: qty }];
    });
    setOpen(true);
  };

  const remove: CartCtx["remove"] = (id) =>
    setItems((prev) => prev.filter((it) => it.producto.id !== id));

  const setQty: CartCtx["setQty"] = (id, qty) =>
    setItems((prev) =>
      prev
        .map((it) => (it.producto.id === id ? { ...it, cantidad: Math.max(1, qty) } : it))
        .filter((it) => it.cantidad > 0),
    );

  const clear = () => setItems([]);

  const count = items.reduce((s, it) => s + it.cantidad, 0);
  const total = items.reduce((s, it) => s + it.cantidad * it.producto.precio, 0);

  return (
    <Ctx.Provider value={{ items, count, total, add, remove, setQty, clear, open, setOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
