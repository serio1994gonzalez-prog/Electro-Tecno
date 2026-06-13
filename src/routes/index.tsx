import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { CategoriesCarousel } from "@/components/CategoriesCarousel";
import { ProductSection } from "@/components/ProductSection";
import { TrustStrip } from "@/components/TrustStrip";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CartFab } from "@/components/CartFab";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { ArgentinaConfetti } from "@/components/ArgentinaConfetti";
import {
  categorias as fallbackCategorias,
  fetchCategorias,
  fetchHomeBanners,
  type Categoria,
  type HomeBanner,
} from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ElectroTecno | Tecnología y hogar" },
      { name: "description", content: "Venta mayorista y minorista de productos electrónicos, herramientas, accesorios y electrodomésticos. Envíos a todo el país. Compra por WhatsApp." },
      { property: "og:title", content: "ElectroTecno | Tecnología y hogar" },
      { property: "og:description", content: "Explorá categorías, banners destacados y productos para el hogar, herramientas y televisores." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(true);
  const [categories, setCategories] = useState<Categoria[]>(fallbackCategorias);
  const [banners, setBanners] = useState<HomeBanner[]>([]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("et_confetti") : null;
    if (saved === "off") setConfetti(false);
  }, []);

  useEffect(() => {
    void Promise.all([fetchCategorias(), fetchHomeBanners()]).then(([nextCategories, nextBanners]) => {
      setCategories(nextCategories);
      setBanners(nextBanners);
    });
  }, []);

  const toggleConfetti = () => {
    setConfetti((v) => {
      const next = !v;
      try {
        localStorage.setItem("et_confetti", next ? "on" : "off");
      } catch {}
      return next;
    });
  };

  const handleSelect = (slug: string | null) => {
    setSelected(slug);
    requestAnimationFrame(() => {
      document.getElementById("destacados")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background flex flex-col relative">
        <ArgentinaConfetti enabled={confetti} />
        <Header />
        <main className="flex-1">
          <HeroSlider banners={banners} onSelectCategory={handleSelect} />
          <CategoriesCarousel categories={categories} selected={selected} onSelect={handleSelect} />
          <ProductSection selected={selected} />
          <TrustStrip />
        </main>
        <Footer />
        <WhatsAppFab />
        <CartFab />
        <CartDrawer />
        <button
          onClick={toggleConfetti}
          aria-label={confetti ? "Apagar confeti" : "Encender confeti"}
          title={confetti ? "Apagar confeti mundialista" : "Encender confeti mundialista"}
          className="fixed bottom-[10.5rem] right-5 md:bottom-24 z-[70] size-11 rounded-full bg-white border border-border shadow-card flex items-center justify-center hover:scale-105 transition"
        >
          <PartyPopper className={`size-5 ${confetti ? "text-[#75AADB]" : "text-muted-foreground"}`} />
        </button>
      </div>
    </CartProvider>
  );
}
