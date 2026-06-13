import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import type { Categoria } from "@/lib/catalog";

interface Props {
  categories: Categoria[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoriesCarousel({ categories, selected, onSelect }: Props) {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!embla) return;
    const update = () => {
      setCanPrev(embla.canScrollPrev());
      setCanNext(embla.canScrollNext());
    };
    embla.on("select", update);
    embla.on("reInit", update);
    update();
    return () => {
      embla.off("select", update);
      embla.off("reInit", update);
    };
  }, [embla, categories.length]);

  return (
    <section id="categorias" className="mx-auto max-w-7xl px-4 md:px-6 mt-12 md:mt-16">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end mb-5 gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
        <h2 className="text-2xl md:text-3xl font-bold">Categorías</h2>
        {selected && (
          <button
            onClick={() => onSelect(null)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todas
          </button>
        )}
      </div>

      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-3 md:gap-4">
            <div className="flex-[0_0_40%] sm:flex-[0_0_26%] md:flex-[0_0_18%] lg:flex-[0_0_14%] min-w-0">
              <CategoryItem
                label="Todos"
                count={null}
                active={selected === null}
                onClick={() => onSelect(null)}
                icon={<LayoutGrid className="size-8 text-primary" />}
              />
            </div>
            {categories.map((c) => (
              <div
                key={c.slug}
                className="flex-[0_0_40%] sm:flex-[0_0_26%] md:flex-[0_0_18%] lg:flex-[0_0_14%] min-w-0"
              >
                <CategoryItem
                  label={c.nombre}
                  count={c.count}
                  active={selected === c.slug}
                  onClick={() => onSelect(c.slug)}
                  image={c.imagen}
                />
              </div>
            ))}
          </div>
        </div>

        {canPrev && (
          <button
            aria-label="Anterior"
            onClick={() => embla?.scrollPrev()}
            className="hidden md:flex absolute -left-3 top-[52px] -translate-y-1/2 z-10 size-9 rounded-full bg-white border border-border shadow-card items-center justify-center hover:scale-105 transition"
          >
            <ChevronLeft className="size-4" />
          </button>
        )}
        {canNext && (
          <button
            aria-label="Siguiente"
            onClick={() => embla?.scrollNext()}
            className="hidden md:flex absolute -right-3 top-[52px] -translate-y-1/2 z-10 size-9 rounded-full bg-white border border-border shadow-card items-center justify-center hover:scale-105 transition"
          >
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>
    </section>
  );
}

function CategoryItem({
  label,
  count,
  active,
  onClick,
  image,
  icon,
}: {
  label: string;
  count: number | null;
  active: boolean;
  onClick: () => void;
  image?: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full flex flex-col items-center gap-2 text-center"
    >
      <div
        className={`w-full aspect-square max-w-[140px] mx-auto rounded-full overflow-hidden border-2 transition-all flex items-center justify-center bg-surface ${
          active
            ? "border-primary shadow-card-hover ring-2 ring-primary/20"
            : "border-border shadow-card group-hover:border-primary/40 group-hover:shadow-card-hover"
        }`}
      >
        {image ? (
          <img
            src={image}
            alt={label}
            loading="lazy"
            onError={(e) => (e.currentTarget.style.opacity = "0")}
            className="w-full h-full object-cover"
          />
        ) : (
          icon
        )}
      </div>
      <span className={`min-h-[2.5rem] text-xs md:text-sm font-medium leading-tight line-clamp-2 ${active ? "text-primary" : ""}`}>
        {label}
      </span>
      {count !== null && <span className="text-[10px] text-muted-foreground whitespace-nowrap">{count} productos</span>}
    </button>
  );
}
