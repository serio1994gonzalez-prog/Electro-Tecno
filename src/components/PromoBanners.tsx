import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 🚀 Importaciones de tus 4 activos reales y únicos
import promoElectrodomesticos from "@/assets/electrodomesticospng.png";
import promoHerramientas from "@/assets/herramientas.png";
import promoTelevisores from "@/assets/promo-televisores.png";
import promoTecnologia from "@/assets/tecnologiapng.png";

interface PromoBannersProps {
  onSelectCategory?: (slug: string | null) => void;
}

const banners = [
  {
    title: "Herramientas",
    cta: "Ver Herramientas",
    textInScreen: "Herramientas", 
    image: promoHerramientas,
  },
  {
    title: "Electrodomésticos",
    cta: "Ver Electrodomesticos",
    textInScreen: "Electrodomesticos", 
    image: promoElectrodomesticos,
  },
  {
    title: "Tecnología y Conectividad",
    cta: "Ver Electronica",
    textInScreen: "Electronica", 
    image: promoTecnologia,
  },
  {
    title: "Televisores",
    cta: "Ver Smartvs",
    textInScreen: "Televisores", 
    image: promoTelevisores,
  },
];

export function PromoBanners({ onSelectCategory }: PromoBannersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleBannerClick = (targetText: string) => {
    const labels = document.querySelectorAll("h3, p, span, font");
    let clicked = false;

    for (const el of labels) {
      const text = el.textContent?.trim().toLowerCase() || "";
      if (text === targetText.toLowerCase()) {
        const clickable = el.closest("button") || el.closest("a") || el;
        if (clickable) {
          (clickable as HTMLElement).click();
          clicked = true;
          break;
        }
      }
    }

    if (!clicked) {
      document.getElementById("destacados")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    if (index !== activeIndex && index >= 0 && index < banners.length) {
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollTo({
      left: clientWidth * index,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const scrollSide = (direction: "left" | "right") => {
    const nextIndex = direction === "left" ? activeIndex - 1 : activeIndex + 1;
    if (nextIndex >= 0 && nextIndex < banners.length) {
      scrollTo(nextIndex);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeIndex === banners.length - 1) {
        scrollTo(0);
      } else {
        scrollSide("right");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section className="relative mx-auto max-w-7xl px-4 md:px-6 mt-6 group">
      {/* Contenedor del carrusel con bordes redondeados */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/70 shadow-lg bg-muted">
        
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
        >
          {banners.map((b) => (
            <div
              key={b.title}
              className="relative flex-none w-full aspect-[1456/720] snap-start"
            >
              {/* Ajuste de escala exacto centrado para evitar cortes en las letras */}
              <img
                src={b.image}
                alt={b.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Capa de acción interactiva */}
              <div className="absolute inset-0 bg-black/5 flex flex-col justify-end p-4 sm:p-6 md:p-12">
                <div className="w-full">
                  <button
                    onClick={() => handleBannerClick(b.textInScreen)}
                    className="inline-flex items-center text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                  >
                    {b.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Flechas de navegación en Hover */}
        <button
          onClick={() => scrollSide("left")}
          disabled={activeIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-9 sm:size-10 rounded-full bg-background/90 backdrop-blur border border-border shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-all duration-300 hover:bg-background"
          aria-label="Anterior"
        >
          <ChevronLeft className="size-5 text-foreground" />
        </button>

        <button
          onClick={() => scrollSide("right")}
          disabled={activeIndex === banners.length - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 size-9 sm:size-10 rounded-full bg-background/90 backdrop-blur border border-border shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-all duration-300 hover:bg-background"
          aria-label="Siguiente"
        >
          <ChevronRight className="size-5 text-foreground" />
        </button>
      </div>

      {/* Indicadores dinámicos estilo Punto y Gota fuera del banner */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {banners.map((_, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 transition-all duration-500 ease-out ${
                isActive 
                  ? "w-7 bg-primary rounded-full" 
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50 rounded-full"
              }`}
              aria-label={`Ir al banner ${index + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
}