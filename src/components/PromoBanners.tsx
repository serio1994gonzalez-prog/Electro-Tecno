import promoHerramientas from "@/assets/promo-herramientas.jpg";
import promoCelulares from "@/assets/promo-celulares.jpg";
import promoHogar from "@/assets/promo-hogar.jpg";

const banners = [
  {
    title: "Herramientas",
    subtitle: "Todo lo que necesitás para tu taller",
    cta: "Ver herramientas",
    href: "#cat-herramientas",
    image: promoHerramientas,
    tone: "dark" as const,
  },
  {
    title: "Accesorios para celulares",
    subtitle: "Fundas, cargadores, cables y mucho más",
    cta: "Ver accesorios",
    href: "#cat-celulares",
    image: promoCelulares,
    tone: "primary" as const,
  },
  {
    title: "Electrodomésticos y Hogar",
    subtitle: "Calidad y tecnología para tu casa",
    cta: "Ver productos",
    href: "#cat-hogar",
    image: promoHogar,
    tone: "light" as const,
  },
];

export function PromoBanners() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
      {banners.map((b) => (
        <a
          key={b.title}
          href={b.href}
          className="group relative overflow-hidden rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all min-h-[180px] flex"
        >
          <div
            className={`flex-1 p-5 md:p-6 flex flex-col justify-between ${
              b.tone === "dark"
                ? "bg-secondary text-secondary-foreground"
                : b.tone === "primary"
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-foreground"
            }`}
          >
            <div>
              <h3 className="text-lg md:text-xl font-bold leading-tight">{b.title}</h3>
              <p className="text-sm opacity-80 mt-1 max-w-[16ch]">{b.subtitle}</p>
            </div>
            <span className="mt-4 self-start inline-flex items-center text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-background/15 backdrop-blur border border-current/20">
              {b.cta}
            </span>
          </div>
          <div className="relative w-1/2">
            <img
              src={b.image}
              alt={b.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </a>
      ))}
    </section>
  );
}
