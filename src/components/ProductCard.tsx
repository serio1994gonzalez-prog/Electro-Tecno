import { useState } from "react";
import type { Producto } from "@/lib/catalog";
import { formatPrice } from "@/lib/catalog";
import { ImageLightbox } from "@/components/ImageLightbox";
import { useCart } from "@/lib/cart";
import { ShoppingCart, Check } from "lucide-react";

export function ProductCard({ producto }: { producto: Producto }) {
  const [zoom, setZoom] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { add } = useCart();

  const handleAdd = () => {
    add(producto, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <>
      <article className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all">
        <button
          type="button"
          onClick={() => !imgFailed && setZoom(true)}
          className="relative aspect-square bg-surface overflow-hidden cursor-zoom-in"
          aria-label={`Ver imagen de ${producto.nombre}`}
        >
          {!imgFailed ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-4 text-center">
              {producto.nombre}
            </div>
          )}
          <span className="absolute top-3 left-3 text-[10px] font-medium tracking-wider uppercase px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
            Cód. {producto.codigo}
          </span>
        </button>

        <div className="p-4 flex-1 flex flex-col gap-2">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            {producto.categoria}
          </p>
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">
            {producto.nombre}
          </h3>
          <p className="text-xl font-bold text-foreground mt-auto">
            {formatPrice(producto.precio)}
          </p>
          <button
            onClick={handleAdd}
            className="mt-2 inline-flex items-center justify-center gap-2 h-10 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            {justAdded ? (
              <>
                <Check className="size-4" /> Agregado
              </>
            ) : (
              <>
                <ShoppingCart className="size-4" /> Agregar al carrito
              </>
            )}
          </button>
        </div>
      </article>

      {zoom && (
        <ImageLightbox src={producto.imagen} alt={producto.nombre} onClose={() => setZoom(false)} />
      )}
    </>
  );
}
