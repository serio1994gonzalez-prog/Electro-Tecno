import { useEffect, useRef } from "react";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  kind: "celeste" | "blanco" | "amarillo" | "flag";
};

const COLORS = {
  celeste: "#75AADB",
  blanco: "#FFFFFF",
  amarillo: "#FCBF49",
};

export function ArgentinaConfetti({ enabled = true }: { enabled?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const piecesRef = useRef<Piece[]>([]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const density = Math.min(120, Math.floor((w * h) / 18000));
    const kinds: Piece["kind"][] = ["celeste", "blanco", "amarillo", "celeste", "blanco", "flag"];

    const spawn = (initial = false): Piece => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : -20 - Math.random() * h * 0.4,
      vx: (Math.random() - 0.5) * 0.6,
      vy: 0.6 + Math.random() * 1.4,
      size: 6 + Math.random() * 8,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.08,
      kind: kinds[Math.floor(Math.random() * kinds.length)],
    });

    piecesRef.current = Array.from({ length: density }, () => spawn(true));

    const drawFlag = (p: Piece) => {
      const s = p.size * 1.6;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const stripe = s / 3;
      ctx.fillStyle = COLORS.celeste;
      ctx.fillRect(-s / 2, -stripe * 1.5, s, stripe);
      ctx.fillStyle = COLORS.blanco;
      ctx.fillRect(-s / 2, -stripe * 0.5, s, stripe);
      ctx.fillStyle = COLORS.celeste;
      ctx.fillRect(-s / 2, stripe * 0.5, s, stripe);
      // sol mini
      ctx.fillStyle = COLORS.amarillo;
      ctx.beginPath();
      ctx.arc(0, 0, stripe * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawPiece = (p: Piece) => {
      if (p.kind === "flag") return drawFlag(p);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = COLORS[p.kind];
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const arr = piecesRef.current;
      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h + 20) arr[i] = spawn(false);
        drawPiece(p);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-normal"
    />
  );
}
