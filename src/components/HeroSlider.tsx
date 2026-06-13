import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildConsultaUrl } from "@/lib/whatsapp";
import type { HomeBanner } from "@/lib/catalog";

interface HeroSliderProps {
  banners: HomeBanner[];
  onSelectCategory?: (slug: string) => void;
}

const AUTOPLAY_MS = 6000;

export function HeroSlider({ banners, onSelectCategory }: HeroSliderProps) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => {
      setSelected(embla.selectedScrollSnap());
      setProgressKey((k) => k + 1);
    };
    embla.on("select", onSelect);
    const t = setInterval(() => embla.scrollNext(), AUTOPLAY_MS);
    onSelect();
    return () => {
      clearInterval(t);
      embla.off("select", onSelect);
    };
  }, [embla]);

  if (!banners.length) return null;

  return (
    <section className="relative mx-auto max-w-7xl px-4 md:px-6 mt-4 md:mt-6">
      <div className="relative overflow-hidden rounded-[28px] shadow-card border border-border/60 bg-background">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {banners.map((banner, i) => (
              <div key={banner.id} className="relative flex-[0_0_100%]">
                <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] md:aspect-[24/9] overflow-hidden bg-surface">
                  <img
                    src={banner.imageUrl}
                    alt={banner.titulo}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />
                  <div className="absolute left-0 right-0 bottom-0 p-2.5 sm:p-4 md:p-6 flex flex-row flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 z-10">
                    <button
                      type="button"
                      onClick={() => onSelectCategory?.(banner.categoriaSlug)}
                      className="inline-flex justify-center items-center h-8 sm:h-11 px-3 sm:px-5 text-xs sm:text-sm rounded-full bg-primary text-primary-foreground font-semibold shadow-card hover:shadow-card-hover active:scale-95 transition-all duration-150"
                    >
                      Ver {banner.titulo}
                    </button>
                    <a
                      href={buildConsultaUrl(`Hola! Quiero consultar por la categoría ${banner.titulo}.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex justify-center items-center h-8 sm:h-11 px-3 sm:px-5 text-xs sm:text-sm rounded-full border border-white/60 text-white bg-black/30 backdrop-blur-sm font-semibold hover:bg-black/50 active:scale-95 transition-all duration-150"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label="Anterior"
          onClick={() => embla?.scrollPrev()}
          className="absolute left-2 sm:left-3 top-1/3 -translate-y-1/2 z-20 size-9 sm:size-10 rounded-full bg-white/90 hover:bg-white shadow-card flex items-center justify-center"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          aria-label="Siguiente"
          onClick={() => embla?.scrollNext()}
          className="absolute right-2 sm:right-3 top-1/3 -translate-y-1/2 z-20 size-9 sm:size-10 rounded-full bg-white/90 hover:bg-white shadow-card flex items-center justify-center"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Progress bar elegante */}
        <div className="relative h-[3px] w-full bg-border/60 overflow-hidden">
          <div
            key={progressKey}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary to-primary/70"
            style={{ animation: `heroProgress ${AUTOPLAY_MS}ms linear forwards` }}
          />
        </div>

        <div className="absolute top-3 right-3 z-20 flex gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1.5">
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              aria-label={`Ir al banner ${i + 1}`}
              onClick={() => embla?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${i === selected ? "bg-white w-6" : "bg-white/60 w-1.5"}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes heroProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
