import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Producto } from "@/lib/catalog";
import { formatPrice } from "@/lib/catalog";
import { buildPedidoUrl } from "@/lib/whatsapp";

export function BuyDialog({ producto, onClose }: { producto: Producto; onClose: () => void }) {
  const [form, setForm] = useState({ nombre: "", apellido: "", telefono: "", direccion: "", numero: "", localidad: "" });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const valid =
    form.nombre.trim().length > 1 &&
    form.apellido.trim().length > 1 &&
    form.telefono.trim().length >= 6 &&
    form.direccion.trim().length > 1 &&
    form.numero.trim().length >= 1 &&
    form.localidad.trim().length > 1;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const url = buildPedidoUrl(producto, form);
    window.open(url, "_blank", "noopener");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-foreground/40 backdrop-blur-sm p-0 md:p-4" onClick={onClose}>
      <div
        className="relative w-full md:max-w-md bg-card text-card-foreground rounded-t-3xl md:rounded-3xl shadow-pop overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 size-9 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted"
        >
          <X className="size-4" />
        </button>

        <div className="flex gap-3 p-5 border-b border-border bg-surface">
          <div className="size-16 rounded-xl bg-background border border-border overflow-hidden flex-shrink-0">
            <img src={producto.imagen} alt="" className="w-full h-full object-contain p-1" onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{producto.categoria}</p>
            <h3 className="text-sm font-semibold leading-snug line-clamp-2">{producto.nombre}</h3>
            <p className="text-base font-bold text-primary">{formatPrice(producto.precio)}</p>
          </div>
        </div>

        <form className="p-5 space-y-3" onSubmit={onSubmit}>
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

          <button
            type="submit"
            disabled={!valid}
            className="w-full h-12 rounded-full bg-whatsapp text-whatsapp-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition shadow-card"
          >
            Enviar pedido por WhatsApp
          </button>
          <p className="text-xs text-muted-foreground text-center">
            Te abriremos WhatsApp con el mensaje listo para enviar.
          </p>
        </form>
      </div>
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
        className="mt-1 w-full h-11 px-4 rounded-xl bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition"
      />
    </label>
  );
}
