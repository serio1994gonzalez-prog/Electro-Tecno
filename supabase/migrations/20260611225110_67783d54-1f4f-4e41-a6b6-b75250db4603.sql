
-- Productos table
CREATE TABLE public.productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text,
  nombre text NOT NULL,
  precio numeric NOT NULL DEFAULT 0,
  categoria_slug text,
  imagen text,
  activo boolean NOT NULL DEFAULT true,
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.productos TO anon, authenticated;
GRANT ALL ON public.productos TO service_role;

ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active productos"
ON public.productos FOR SELECT
TO anon, authenticated
USING (activo = true);

-- TEMP: open writes until admin auth is wired. Replace with has_role check after auth.
CREATE POLICY "Temporary open insert productos"
ON public.productos FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Temporary open update productos"
ON public.productos FOR UPDATE
TO anon, authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Temporary open delete productos"
ON public.productos FOR DELETE
TO anon, authenticated
USING (true);

CREATE POLICY "Admins read all productos"
ON public.productos FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER productos_set_updated_at
BEFORE UPDATE ON public.productos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX productos_categoria_idx ON public.productos (categoria_slug);
CREATE INDEX productos_activo_idx ON public.productos (activo);

-- Storage policies for the "productos" bucket (bucket created via tool)
CREATE POLICY "Public read productos bucket"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'productos');

CREATE POLICY "Temporary public upload productos bucket"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'productos');

CREATE POLICY "Temporary public update productos bucket"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'productos') WITH CHECK (bucket_id = 'productos');

CREATE POLICY "Temporary public delete productos bucket"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'productos');
