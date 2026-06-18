import rawProducts from "@/data/productos.json";
import { supabase } from "@/integrations/supabase/client";


export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  codigo: string;
  imagen: string;
}

export interface Categoria {
  slug: string;
  nombre: string;
  count: number;
  imagen: string;
}

export interface HomeBanner {
  id: string;
  titulo: string;
  subtitulo: string | null;
  imageUrl: string;
  categoriaSlug: string;
  orden: number;
}

const catalogoBase: Producto[] = (rawProducts as Producto[]).map((p) => ({
  ...p,
  nombre: titleCase(p.nombre),
  categoria: titleCase(p.categoria),
}));

function titleCase(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b([a-záéíóúñü])/g, (m) => m.toUpperCase());
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categorySynonyms: Record<string, string> = {
  tecnologia: "electronica",
};

function normalizeCategoriaSlug(slug: string) {
  return categorySynonyms[slug] ?? slug;
}

const categoriaMap = new Map<string, Categoria>();
for (const p of catalogoBase) {
  const slug = slugify(p.categoria);
  const existing = categoriaMap.get(slug);
  if (existing) {
    existing.count++;
  } else {
    categoriaMap.set(slug, {
      slug,
      nombre: p.categoria,
      count: 1,
      imagen: p.imagen,
    });
  }
}

export const categorias: Categoria[] = [...categoriaMap.values()].sort((a, b) => b.count - a.count);
export const productos = catalogoBase;

export function formatPrice(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

const PINNED_CODES = ["ESTGF", "SPR3M", "ARFR7", "IRNTK"];

export function getDestacados(n = 12): Producto[] {
  const pinned = PINNED_CODES
    .map((c) => catalogoBase.find((p) => p.codigo === c))
    .filter((p): p is Producto => Boolean(p));
  const rest = catalogoBase
    .filter((p) => !PINNED_CODES.includes(p.codigo))
    .sort((a, b) => ((a.id * 9301 + 49297) % 233280) - ((b.id * 9301 + 49297) % 233280));
  return [...pinned, ...rest].slice(0, n);
}

export function getByCategoria(slug: string): Producto[] {
  const normalized = normalizeCategoriaSlug(slug);
  return catalogoBase.filter((p) => slugify(p.categoria) === normalized);
}

export async function fetchCategorias(): Promise<Categoria[]> {
  // Devolvemos TODAS las categorías derivadas del catálogo,
  // enriquecidas con datos de la tabla `categorias` cuando existan (nombre/imagen).
  const { data } = await supabase
    .from("categorias")
    .select("nombre, slug, imagen")
    .order("orden", { ascending: true });

  const overrides = new Map<string, { nombre: string; imagen: string | null }>();
  (data ?? []).forEach((c) => {
    overrides.set(c.slug, { nombre: c.nombre, imagen: c.imagen ?? null });
  });

  return categorias.map((c) => {
    const o = overrides.get(c.slug);
    return {
      slug: c.slug,
      nombre: o?.nombre ?? c.nombre,
      imagen: o?.imagen ?? c.imagen,
      count: c.count,
    };
  });
}

export async function fetchHomeBanners(): Promise<HomeBanner[]> {
  const { data, error } = await supabase
    .from("banners_home")
    .select("id, titulo, subtitulo, image_url, categoria_slug, orden")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error || !data?.length) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    titulo: row.titulo,
    subtitulo: row.subtitulo,
    imageUrl: row.image_url,
    categoriaSlug: row.categoria_slug,
    orden: row.orden,
  }));
}

function fallbackImageForCategory(slug: string) {
  return getByCategoria(slug)[0]?.imagen ?? catalogoBase[0]?.imagen ?? "";
}

