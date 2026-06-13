## 1. Estilo Mundial Argentina (rápido, frontend)

- Componente `ArgentinaConfetti` con canvas liviano: confeti celeste (#75AADB), amarillo (#FFD100) y blanco cayendo en loop suave, densidad moderada para no tapar UI.
- Pequeñas banderitas argentinas (SVG) mezcladas entre los confetis.
- Activo en home (`/`). Respeta `prefers-reduced-motion` (lo desactiva).
- Toggle simple para apagarlo desde el header (icono pequeño) por si molesta al comprar.

## 2. Acceso oculto al Admin

- Mantener presionado el logo 5s (mouse/touch) → abre modal "Acceso Administrador".
- Input código + botón Ingresar. Código `0609`.
- Si ok → navega a `/admin`. Si error → toast suave.
- El código vive en frontend solo como gate de UI; la seguridad real es la sesión Supabase (paso siguiente).

## 3. Lovable Cloud + esquema

Habilito Cloud y creo:

**Tablas**
- `categorias` (id, slug, nombre, imagen_url, orden, created_at)
- `productos` (id, codigo, nombre, descripcion, precio, stock, categoria_id, imagen_url, activo, created_at)
- `banners` (id, titulo, subtitulo, texto_boton, imagen_url, categoria_slug, orden, activo)
- `user_roles` (id, user_id, role enum 'admin'|'user') + función `has_role`

**Storage buckets públicos**
- `productos`, `categorias`, `banners`

**RLS**
- Lectura pública (anon + authenticated) en productos/categorías/banners activos.
- Escritura solo `has_role(auth.uid(),'admin')`.

**Auth**
- Email+password. El primer usuario que ingrese el código `0609` y se registre queda como admin (seed manual del rol vía migración para el email que me indiques, o botón "marcarme admin" la primera vez si no hay admins).

## 4. Panel `/admin` (layout SaaS blanco)

- Layout con sidebar gris claro: Dashboard, Productos, Categorías, Promos.
- Ruta protegida `_authenticated/admin/*` + check de rol admin (si no es admin, 403 suave).
- Tipografía Inter, bordes 12–14px, sombras mínimas.

## 5. Módulo Productos

- Tabla: imagen, nombre, categoría, precio, stock, acciones (editar/eliminar).
- Drawer/form: imagen (upload a bucket `productos`), nombre, precio, categoría (dropdown), stock, descripción.
- Toda la data desde tabla `productos`. La home pasa a leer de Supabase (reemplaza `productos.json`).

## 6. Importador XLSX/CSV

- Botón "Importar productos" → input file.
- Parse con `xlsx` (SheetJS, ya compatible con worker).
- Detección flexible de columnas: nombre, precio, categoría, código, stock, imagen (URL o nombre de archivo).
- Auto-crea categorías nuevas.
- Preview en tabla con validación (precio inválido, nombre vacío) → "Confirmar importación" → insert masivo.
- PDF queda fuera de scope inicial (poco confiable); lo agregamos si lo necesitás.

## 7. Módulo Categorías

- Lista con imagen, nombre, cantidad de productos (count).
- Crear/editar/eliminar. Upload imagen a bucket `categorias`.

## 8. Módulo Promos (Banners)

- CRUD con imagen, título, subtítulo, texto botón, categoría destino.
- El `HeroSlider` del home pasa a leer de tabla `banners` activos ordenados.
- Click en banner → scrollea/filtra por la categoría asociada.

## 9. Orden de entrega sugerido

1. Confetti + banderitas + toggle (este turno).
2. Habilitar Cloud + migración (tablas, RLS, storage, roles).
3. Gate oculto del logo + modal código + login admin.
4. Layout `/admin` + Productos CRUD + lectura desde Supabase en home.
5. Importador XLSX.
6. Categorías CRUD.
7. Banners CRUD + HeroSlider dinámico.

## Preguntas antes de arrancar la Fase 2

1. **Email del admin inicial**: ¿qué email usás para loguearte? Lo seedeo como admin en la migración.
2. **Confetti**: ¿siempre encendido o solo en home y desktop? (por defecto: solo home, con toggle).
3. **Productos actuales en `productos.json`**: ¿los migro a la base como seed inicial o arrancás vacío y cargás por XLSX?
