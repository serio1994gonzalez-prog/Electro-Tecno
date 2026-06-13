-- Drop overly permissive policies
DROP POLICY IF EXISTS "Temporary open insert productos" ON public.productos;
DROP POLICY IF EXISTS "Temporary open update productos" ON public.productos;
DROP POLICY IF EXISTS "Temporary open delete productos" ON public.productos;

-- Admin-only write policies (same pattern as categorias / banners_home)
CREATE POLICY "Admins can insert productos"
ON public.productos
FOR INSERT
TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update productos"
ON public.productos
FOR UPDATE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete productos"
ON public.productos
FOR DELETE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));