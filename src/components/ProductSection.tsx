import { useState, useEffect, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { categorias, getByCategoria, getDestacados } from "@/lib/catalog";

interface Props {
  selected: string | null;
}

type SortMode = "destacado" | "precio-asc" | "precio-desc" | "nombre";

const SORT_LABELS: Record<SortMode, string> = {
  destacado: "Destacados",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
  nombre: "Nombre A–Z",
};

export function ProductSection({ selected }: Props) {
  const [limit, setLimit] = useState(24);
  const [sort, setSort] = useState<SortMode>("destacado");

  useEffect(() => {
    setLimit(24);
  }, [selected]);

  const { list, title } = useMemo(() => {
    const base = !selected ? getDestacados(60) : getByCategoria(selected);
    const t = !selected
      ? "Productos destacados"
      : categorias.find((c) => c.slug === selected)?.nombre ?? "Productos";
    const sorted = [...base];
    if (sort === "precio-asc") sorted.sort((a, b) => a.precio - b.precio);
    else if (sort === "precio-desc") sorted.sort((a, b) => b.precio - a.precio);
    else if (sort === "nombre") sorted.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    return { list: sorted, title: t };
  }, [selected, sort]);

  return (
    <section id="destacados" className="mx-auto max-w-7xl px-4 md:px-6 mt-12 md:mt-16 scroll-mt-24">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <div className="flex items-center gap-3 ml-auto">
          <label className="relative inline-flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowUpDown className="size-3.5 opacity-70" />
            <span className="hidden sm:inline tracking-wide">Ordenar</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              aria-label="Ordenar productos"
              className="h-8 pl-2 pr-7 rounded-full border border-border/70 bg-background/60 backdrop-blur-sm text-xs font-medium text-foreground hover:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/40 transition appearance-none cursor-pointer"
            >
              {(Object.keys(SORT_LABELS) as SortMode[]).map((k) => (
                <option key={k} value={k}>{SORT_LABELS[k]}</option>
              ))}
            </select>
          </label>
          <span className="text-xs text-muted-foreground shrink-0">{list.length} productos</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {list.slice(0, limit).map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>

      {list.length > limit && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setLimit(limit + 24)}
            className="h-11 px-7 rounded-full border border-border hover:border-primary/40 hover:bg-surface font-medium text-sm transition"
          >
            Ver más productos
          </button>
        </div>
      )}
    </section>
  );
}
