import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Upload, ArrowLeft, Search, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  listProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  uploadProductImage,
  importarCatalogoJSON,
  type ProductoRow,
} from "@/lib/admin-productos";
import { fetchCategorias, formatPrice, type Categoria } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin · ElectroTecno" }, { name: "robots", content: "noindex" }] }),
  component: AdminProductos,
});

function AdminProductos() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ProductoRow[]>([]);
  const [cats, setCats] = useState<Categoria[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<ProductoRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!active) return;
      if (!u.user) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!active) return;
      if (error || !roles) {

        toast.error("Acceso denegado");
        navigate({ to: "/" });
        return;
      }
      setAuthed(true);
    })();
    return () => { active = false; };
  }, [navigate]);


  const reload = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([listProductos(), fetchCategorias()]);
      setItems(p);
      setCats(c);
    } catch (e) {
      toast.error("Error cargando datos");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) void reload();
  }, [authed]);

  const filtered = useMemo(() => {
    if (!q) return items;
    const s = q.toLowerCase();
    return items.filter((p) => p.nombre.toLowerCase().includes(s) || (p.codigo ?? "").toLowerCase().includes(s));
  }, [items, q]);

  const handleImport = async () => {
    if (!confirm(`Importar todos los productos del catálogo actual a la base?`)) return;
    setImporting(true);
    try {
      const n = await importarCatalogoJSON();
      toast.success(`${n} productos importados`);
      await reload();
    } catch (e: any) {
      toast.error(e.message ?? "Error importando");
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async (p: ProductoRow) => {
    if (!confirm(`Eliminar "${p.nombre}"?`)) return;
    try {
      await deleteProducto(p.id);
      setItems((prev) => prev.filter((x) => x.id !== p.id));
      toast.success("Producto eliminado");
    } catch (e: any) {
      toast.error(e.message ?? "Error");
    }
  };

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="sticky top-0 z-30 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-5 h-14 flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Volver
          </Link>
          <h1 className="font-semibold tracking-tight">Admin · Productos</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleImport} disabled={importing}>
              {importing ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              <span className="ml-1.5">Importar catálogo</span>
            </Button>
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="size-4 mr-1" /> Nuevo producto
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nombre o código…"
                className="pl-9"
              />
            </div>
            <span className="text-xs text-muted-foreground ml-auto">{filtered.length} de {items.length}</span>
          </div>

          {loading ? (
            <div className="p-16 flex justify-center"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
          ) : items.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              <p className="mb-3">No hay productos cargados aún.</p>
              <Button onClick={handleImport} disabled={importing}>
                {importing ? <Loader2 className="size-4 animate-spin mr-2" /> : <Upload className="size-4 mr-2" />}
                Importar catálogo inicial
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition">
                  <div className="size-14 rounded-lg overflow-hidden bg-surface border border-border shrink-0 flex items-center justify-center">
                    {p.imagen ? (
                      <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <ImageIcon className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{p.nombre}</div>
                    <div className="text-xs text-muted-foreground">{p.codigo ?? "—"} · {p.categoria_slug ?? "sin categoría"}</div>
                  </div>
                  <div className="text-sm font-semibold tabular-nums w-28 text-right">{formatPrice(p.precio)}</div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(p)}><Pencil className="size-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p)}><Trash2 className="size-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {(editing || creating) && (
        <ProductDialog
          open
          producto={editing}
          cats={cats}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={async () => { setEditing(null); setCreating(false); await reload(); }}
        />
      )}
    </div>
  );
}

function ProductDialog({
  open,
  producto,
  cats,
  onClose,
  onSaved,
}: {
  open: boolean;
  producto: ProductoRow | null;
  cats: Categoria[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!producto;
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [precio, setPrecio] = useState<string>(producto ? String(producto.precio) : "");
  const [categoria, setCategoria] = useState<string>(producto?.categoria_slug ?? "");
  const [codigo, setCodigo] = useState(producto?.codigo ?? "");
  const [imagen, setImagen] = useState(producto?.imagen ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setImagen(url);
      toast.success("Imagen subida");
    } catch (e: any) {
      toast.error(e.message ?? "Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return toast.error("Nombre requerido");
    const precioNum = Number(precio);
    if (!Number.isFinite(precioNum) || precioNum < 0) return toast.error("Precio inválido");
    setSaving(true);
    try {
      const payload = {
        nombre: nombre.trim(),
        precio: precioNum,
        categoria_slug: categoria || null,
        codigo: codigo.trim() || null,
        imagen: imagen || null,
      };
      if (isEdit && producto) await updateProducto(producto.id, payload);
      else await createProducto(payload);
      toast.success(isEdit ? "Producto actualizado" : "Producto creado");
      onSaved();
    } catch (e: any) {
      toast.error(e.message ?? "Error guardando");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          <DialogDescription>Completá los datos del producto.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-start gap-4">
            <label className="size-24 rounded-xl border-2 border-dashed border-border bg-surface flex items-center justify-center cursor-pointer hover:border-primary overflow-hidden shrink-0">
              {uploading ? (
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              ) : imagen ? (
                <img src={imagen} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <ImageIcon className="size-5" />
                  <span className="text-[10px] mt-1">Subir foto</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                }}
              />
            </label>
            <div className="flex-1 space-y-2">
              <Label className="text-xs">URL imagen (opcional)</Label>
              <Input value={imagen} onChange={(e) => setImagen(e.target.value)} placeholder="https://…" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Nombre</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Precio</Label>
              <Input type="number" step="0.01" min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Código</Label>
              <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Categoría</Label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger><SelectValue placeholder="Seleccionar categoría…" /></SelectTrigger>
              <SelectContent>
                {cats.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>{c.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving && <Loader2 className="size-4 animate-spin mr-2" />}
              {isEdit ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
