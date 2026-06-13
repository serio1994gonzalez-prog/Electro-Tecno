import { Link } from "@tanstack/react-router";
import { Search, Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";
import logoAsset from "@/assets/logo-electrotecno.png.asset.json";
import { INSTAGRAM_URL, TIKTOK_URL, WHATSAPP_URL, buildConsultaUrl } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";
import { AdminGate } from "@/components/AdminGate";

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="igGrad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#igGrad)" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="17.7" cy="6.3" r="1.2" fill="#fff" />
    </svg>
  );
}

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#000" />
      <path
        d="M16.5 9.4a4.5 4.5 0 0 1-2.7-.9v5.8a3.7 3.7 0 1 1-3.7-3.7c.2 0 .4 0 .6.1v1.9a1.8 1.8 0 1 0 1.3 1.7V5.8h1.9a2.7 2.7 0 0 0 2.6 2.6z"
        fill="#25F4EE"
        transform="translate(0.6 0.6)"
      />
      <path
        d="M16.5 9.4a4.5 4.5 0 0 1-2.7-.9v5.8a3.7 3.7 0 1 1-3.7-3.7c.2 0 .4 0 .6.1v1.9a1.8 1.8 0 1 0 1.3 1.7V5.8h1.9a2.7 2.7 0 0 0 2.6 2.6z"
        fill="#FE2C55"
        transform="translate(-0.6 -0.6)"
      />
      <path
        d="M16.5 9.4a4.5 4.5 0 0 1-2.7-.9v5.8a3.7 3.7 0 1 1-3.7-3.7c.2 0 .4 0 .6.1v1.9a1.8 1.8 0 1 0 1.3 1.7V5.8h1.9a2.7 2.7 0 0 0 2.6 2.6z"
        fill="#fff"
      />
    </svg>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#25D366" d="M12 0C5.373 0 0 5.373 0 12c0 2.146.566 4.168 1.556 5.936L.528 23.47l5.678-1.03A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.72 16.64c-.25.705-1.44 1.33-2.006 1.41-.53.075-1.066.15-3.084-.64-2.59-1.03-4.27-3.67-4.4-3.84-.13-.17-1.05-1.4-1.05-2.67 0-1.27.67-1.9.91-2.16.24-.26.53-.33.7-.33.18 0 .35 0 .5.006.16.006.38-.06.59.45.2.51.69 1.78.75 1.9.06.13.1.27.02.4-.08.13-.12.2-.24.31-.12.11-.25.25-.36.34-.11.08-.23.17-.1.34.13.17.58.85.88 1.16.45.47.9.78 1.15.87.14.06.24.03.33-.03.09-.06.38-.45.48-.6.1-.15.2-.13.33-.08.13.05.84.4.98.47.14.07.23.1.27.16.03.06.03.34-.07.84z" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      {/* top strip */}
      <div className="hidden md:flex items-center justify-between text-xs px-6 py-2 bg-secondary text-secondary-foreground">
        <span className="opacity-90">Venta mayorista y minorista · Productos electrónicos, herramientas y más</span>
        <div className="flex items-center gap-5 opacity-90">
          <span>🚚 Envíos a todo el país</span>
          <a href={buildConsultaUrl()} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <WhatsAppGlyph className="size-4" /> Atención por WhatsApp
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 h-20 md:h-24 flex items-center gap-4 md:gap-8">
        <button
          aria-label="Menú"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center size-10 rounded-full hover:bg-muted"
        >
          <Menu className="size-5" />
        </button>

        <AdminGate className="relative shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset.url} alt="ElectroTecno" className="h-14 md:h-20 w-auto pointer-events-none" draggable={false} />
          </Link>
        </AdminGate>

        <div className="hidden md:flex flex-1 max-w-xl mx-auto">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <SocialButton href={INSTAGRAM_URL} label="Instagram">
            <InstagramGlyph className="size-7" />
          </SocialButton>
          <SocialButton href={TIKTOK_URL} label="TikTok">
            <TikTokGlyph className="size-7" />
          </SocialButton>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="inline-flex items-center justify-center size-12 rounded-full hover:scale-105 transition-transform"
          >
            <WhatsAppGlyph className="size-7" />
          </a>
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Abrir carrito"
            className="relative inline-flex items-center justify-center size-12 rounded-full border border-border bg-background hover:bg-muted transition"
          >
            <ShoppingCart className="size-6" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* mobile search */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-2 text-sm">
          <Link to="/" onClick={() => setOpen(false)} className="py-2">Inicio</Link>
          <a href="#categorias" onClick={() => setOpen(false)} className="py-2">Categorías</a>
          <a href="#destacados" onClick={() => setOpen(false)} className="py-2">Productos destacados</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="py-2">Instagram</a>
          <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="py-2">TikTok</a>
        </nav>
      )}
    </header>
  );
}

function SearchBar() {
  return (
    <form
      action="#destacados"
      className="flex items-center w-full h-11 rounded-full bg-surface border border-border px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition"
    >
      <Search className="size-4 text-muted-foreground" />
      <input
        type="search"
        placeholder="¿Qué estás buscando?"
        className="flex-1 bg-transparent outline-none px-3 text-sm placeholder:text-muted-foreground"
      />
    </form>
  );
}

function SocialButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center size-12 rounded-full hover:scale-105 transition-transform"
    >
      {children}
    </a>
  );
}

