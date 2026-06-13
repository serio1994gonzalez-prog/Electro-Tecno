import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { buildCartPedidoUrl } from "@/lib/whatsapp";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.52 3.48A11.78 11.78 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.88c0 2.09.55 4.13 1.6 5.93L0 24l6.34-1.66a11.88 11.88 0 0 0 5.7 1.45h.01c6.55 0 11.88-5.33 11.88-11.88a11.8 11.8 0 0 0-3.41-8.43zM12.05 21.5h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.67-.23-.38a9.85 9.85 0 0 1-1.5-5.21c0-5.44 4.43-9.86 9.87-9.86 2.64 0 5.11 1.03 6.98 2.9a9.81 9.81 0 0 1 2.89 6.98c0 5.44-4.43 9.84-9.85 9.84zm5.4-7.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.94 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.18-.24-.58-.49-.5-.66-.51-.17-.01-.37-.01-.57-.01a1.1 1.1 0 0 0-.8.37c-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
    </svg>
  );
}

export function CartDrawer() {
  const { items, total, count, remove, setQty, clear, open, setOpen } = useCart();
  const [step, setStep] = useState<"cart" | "form">("cart");
  const [form, setForm] = useState({ nombre: "", apellido: "", telefono: "", direccion: "", numero: "", localidad: "" });

  if (!open) return null;

  const valid =
    form.nombre.trim().length > 1 &&
    form.apellido.trim().length > 1 &&
    form.telefono.trim().length >= 6 &&
    form.direccion.trim().length > 1 &&
    form.numero.trim().length >= 1 &&
    form.localidad.trim().length > 1;

  const close = () => {
    setOpen(false);
    setTimeout(() => setStep("cart"), 300);
  };

  const sendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || items.length === 0) return;
    const url = buildCartPedidoUrl(items, form);
    window.open(url, "_blank", "noopener");
    clear();
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40 backdrop-blur-sm" onClick={close}>
      <aside
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-card text-card-foreground flex flex-col shadow-pop animate-in slide-in-from-right duration-300"
      >
        <header className="flex items-center justify-between px-5 h-16 border-b border-border">
          <div className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="size-5" />
            <span>{step === "cart" ? `Tu carrito (${count})` : "Datos de envío"}</span>
          </div>
          <button onClick={close} aria-label="Cerrar" className="size-9 rounded-full hover:bg-muted flex items-center justify-center">
            <X className="size-4" />
          </button>
        </header>

        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-muted-foreground py-16">
                  <ShoppingBag className="size-12 opacity-40" />
                  <p>Tu carrito está vacío.</p>
                  <button onClick={close} className="text-primary font-medium hover:underline">
                    Seguir comprando
                  </button>
                </div>
              ) : (
                items.map((it) => (
                  <div key={it.producto.id} className="flex gap-3 bg-surface border border-border rounded-2xl p-3">
                    <div className="size-16 rounded-xl bg-background border border-border overflow-hidden flex-shrink-0">
                      <img
                        src={it.producto.imagen}
                        alt=""
                        className="w-full h-full object-contain p-1"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{it.producto.categoria}</p>
                      <h4 className="text-sm font-semibold leading-snug line-clamp-2">{it.producto.nombre}</h4>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center bg-background border border-border rounded-full">
                          <button onClick={() => setQty(it.producto.id, it.cantidad - 1)} className="size-7 flex items-center justify-center hover:bg-muted rounded-l-full" aria-label="Restar">
                            <Minus className="size-3" />
                          </button>
                          <span className="px-2 text-sm font-medium tabular-nums w-7 text-center">{it.cantidad}</span>
                          <button onClick={() => setQty(it.producto.id, it.cantidad + 1)} className="size-7 flex items-center justify-center hover:bg-muted rounded-r-full" aria-label="Sumar">
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <p className="text-sm font-bold">{formatPrice(it.producto.precio * it.cantidad)}</p>
                      </div>
                    </div>
                    <button onClick={() => remove(it.producto.id)} aria-label="Quitar" className="size-8 rounded-full hover:bg-muted flex items-center justify-center self-start text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border p-5 space-y-3 bg-surface">
                <div className="flex items-center justify-between text-base">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-xl font-bold">{formatPrice(total)}</span>
                </div>
                <button
                  onClick={() => setStep("form")}
                  className="w-full h-12 rounded-full bg-whatsapp text-whatsapp-foreground font-semibold inline-flex items-center justify-center gap-2 hover:brightness-110 transition shadow-card"
                >
                  <WhatsAppIcon className="size-5" /> Finalizar compra por WhatsApp
                </button>
                <button onClick={clear} className="w-full text-xs text-muted-foreground hover:text-foreground transition">
                  Vaciar carrito
                </button>
              </footer>
            )}
          </>
        )}

        {step === "form" && (
          <form onSubmit={sendOrder} className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              <button type="button" onClick={() => setStep("cart")} className="text-xs text-primary hover:underline">
                ← Volver al carrito
              </button>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nombre *" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} placeholder="Juan" autoFocus />
                <Field label="Apellido *" value={form.apellido} onChange={(v) => setForm({ ...form, apellido: v })} placeholder="Pérez" />
              </div>
              <Field label="Teléfono *" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} placeholder="11 2345 6789" type="tel" />
              <div className="grid grid-cols-[1fr_110px] gap-3">
                <Field label="Dirección *" value={form.direccion} onChange={(v) => setForm({ ...form, direccion: v })} placeholder="Calle" />
                <Field label="Número *" value={form.numero} onChange={(v) => setForm({ ...form, numero: v })} placeholder="1234" />
              </div>
              <Field label="Localidad *" value={form.localidad} onChange={(v) => setForm({ ...form, localidad: v })} placeholder="Ej: El Mirador" />
            </div>
            <footer className="border-t border-border p-5 space-y-2 bg-surface">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{count} productos</span>
                <span className="text-lg font-bold">{formatPrice(total)}</span>
              </div>
              <button
                type="submit"
                disabled={!valid}
                className="w-full h-12 rounded-full bg-whatsapp text-whatsapp-foreground font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition shadow-card"
              >
                <WhatsAppIcon className="size-5" /> Enviar pedido por WhatsApp
              </button>
            </footer>
          </form>
        )}
      </aside>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", autoFocus,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="mt-1 w-full h-11 px-4 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition"
      />
    </label>
  );
}
