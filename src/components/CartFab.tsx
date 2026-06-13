import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export function CartFab() {
  const { count, setOpen } = useCart();
  const [pulse, setPulse] = useState(false);
  const prev = useRef(count);

  useEffect(() => {
    if (count > prev.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 700);
      return () => clearTimeout(t);
    }
    prev.current = count;
  }, [count]);

  useEffect(() => {
    prev.current = count;
  }, [count]);

  if (count === 0) return null;

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label={`Abrir carrito (${count})`}
      className={`md:hidden fixed bottom-24 right-5 z-40 size-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-pop flex items-center justify-center hover:scale-105 active:scale-95 transition-transform ring-1 ring-white/20 ${
        pulse ? "animate-in zoom-in-50 duration-300" : ""
      }`}
    >
      <ShoppingBag className="size-6" strokeWidth={2.2} />
      <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-foreground text-background text-[11px] font-bold flex items-center justify-center ring-2 ring-background tabular-nums">
        {count}
      </span>
      {pulse && (
        <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" aria-hidden />
      )}
    </button>
  );
}
