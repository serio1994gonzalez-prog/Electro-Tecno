import { MapPin, Phone, Clock, Mail } from "lucide-react";
// 🚀 Importación directa corregida para que el logo se vea correctamente
import logoImage from "@/assets/logo-electrotecno.png";
import { INSTAGRAM_URL, TIKTOK_URL, WHATSAPP_URL } from "@/lib/whatsapp";

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="footerIgGrad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#footerIgGrad)" />
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

export function Footer() {
  return (
    <footer className="mt-16 md:mt-24 bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          {/* Logo corregido */}
          <img src={logoImage} alt="ElectroTecno" className="h-10 w-auto mb-4" />
          <p className="text-sm opacity-75 max-w-xs">
            Venta mayorista y minorista de productos electrónicos, herramientas, accesorios y mucho más.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram" className="size-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <InstagramGlyph className="size-7" />
            </a>
            <a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="TikTok" className="size-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <TikTokGlyph className="size-7" />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="size-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <WhatsAppGlyph className="size-7" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4 text-primary">Contacto</h4>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex items-start gap-2"><MapPin className="size-4 mt-0.5 shrink-0" />Almirante Brown 3410, Lomas del Mirador, Buenos Aires</li>
            <li className="flex items-center gap-2"><Phone className="size-4" /> +54 9 11 3036 9394</li>
            <li className="flex items-center gap-2"><Mail className="size-4" /> info@electrotecno.ar</li>
            <li className="flex items-center gap-2"><Clock className="size-4" /> Lunes a Sábados de 9 a 18hs</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4 text-primary">Enlaces</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><a href="/" className="hover:text-primary">Inicio</a></li>
            <li><a href="#categorias" className="hover:text-primary">Categorías</a></li>
            <li><a href="#destacados" className="hover:text-primary">Productos</a></li>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-primary">Contacto</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4 text-primary">Información</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Envíos a todo el país</li>
            <li>Mayorista y minorista</li>
            <li>Más de 800 productos</li>
            <li>Atención por WhatsApp</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-5 text-center text-xs opacity-70">
          © {new Date().getFullYear()} ElectroTecno. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}