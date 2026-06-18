import type { Producto } from "@/lib/catalog";
import { formatPrice } from "@/lib/catalog";
import type { CartItem } from "@/lib/cart";

export const WHATSAPP_NUMBER = "5491136198561";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const INSTAGRAM_URL = "https://www.instagram.com/mayoristavico";
export const TIKTOK_URL = "https://www.tiktok.com/@mayoristavico";

export interface PedidoData {
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  numero: string;
  localidad: string;
}

function fullName(d: PedidoData) {
  return `${d.nombre} ${d.apellido}`.trim();
}

export function buildPedidoUrl(producto: Producto, data: PedidoData) {
  const msg = [
    "🛒 NUEVO PEDIDO MAYORISTA VICO",
    "",
    `Producto: ${producto.nombre}`,
    `Código: ${producto.codigo}`,
    `Precio: ${formatPrice(producto.precio)}`,
    "",
    `Cliente: ${fullName(data)}`,
    `Tel: ${data.telefono}`,
    `Dirección: ${data.direccion} ${data.numero}`,
    `Localidad: ${data.localidad}`,
  ].join("\n");
  return `${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`;
}

export function buildCartPedidoUrl(items: CartItem[], data: PedidoData) {
  const total = items.reduce((s, it) => s + it.cantidad * it.producto.precio, 0);
  const lines: string[] = [
    "🛒 NUEVO PEDIDO MAYORISTA VICO",
    "",
    `Cliente: ${fullName(data)}`,
    `Tel: ${data.telefono}`,
    `Dirección: ${data.direccion} ${data.numero}`,
    `Localidad: ${data.localidad}`,
    "",
    "── PRODUCTOS ──",
  ];
  items.forEach((it, i) => {
    lines.push(
      `${i + 1}. ${it.producto.nombre}`,
      `   Cód: ${it.producto.codigo} · x${it.cantidad} · ${formatPrice(it.producto.precio * it.cantidad)}`,
    );
  });
  lines.push("", `TOTAL: ${formatPrice(total)}`);
  return `${WHATSAPP_URL}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildConsultaUrl(text = "Hola! Quería hacer una consulta.") {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}
