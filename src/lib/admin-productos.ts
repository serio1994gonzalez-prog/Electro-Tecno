import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/catalog";
import rawProducts from "@/data/productos.json";

export interface ProductoRow {
  id: string;
  codigo: string | null;
  nombre: string;
  precio: number;
  categoria_slug: string | null;
  imagen: string | null;
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
}

const BUCKET = "productos";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // 10 años

export async function listProductos(): Promise<ProductoRow[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProductoRow[];
}

export async function createProducto(input: Partial<ProductoRow>) {
  const { error } = await supabase.from("productos").insert({
    nombre: input.nombre ?? "Sin nombre",
    precio: input.precio ?? 0,
    categoria_slug: input.categoria_slug ?? null,
    imagen: input.imagen ?? null,
    codigo: input.codigo ?? null,
    activo: input.activo ?? true,
  });
  if (error) throw error;
}

export async function updateProducto(id: string, patch: Partial<ProductoRow>) {
  const { error } = await supabase.from("productos").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteProducto(id: string) {
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (upErr) throw upErr;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
  if (error) throw error;
  return data.signedUrl;
}

export async function importarCatalogoJSON() {
  const items = (rawProducts as Array<{ nombre: string; precio: number; categoria: string; codigo: string; imagen: string }>).map((p) => ({
    nombre: p.nombre,
    precio: p.precio,
    categoria_slug: slugify(p.categoria),
    imagen: p.imagen,
    codigo: p.codigo,
    activo: true,
  }));
  // chunked insert
  const chunkSize = 200;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const { error } = await supabase.from("productos").insert(chunk);
    if (error) throw error;
  }
  return items.length;
}
