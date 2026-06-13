import { ShieldCheck, Truck, MessageCircle, Tag } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Compra segura", text: "Tus datos protegidos" },
  { icon: Truck, title: "Envíos a todo el país", text: "Rápidos y confiables" },
  { icon: MessageCircle, title: "Atención personalizada", text: "Por WhatsApp" },
  { icon: Tag, title: "Precios mayoristas", text: "Consultanos por cantidad" },
];

export function TrustStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 mt-12 md:mt-16">
      <div className="rounded-2xl bg-secondary text-secondary-foreground grid grid-cols-2 md:grid-cols-4 gap-4 p-5 md:p-7">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-white/10 flex items-center justify-center">
              <it.icon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{it.title}</p>
              <p className="text-xs opacity-75">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
