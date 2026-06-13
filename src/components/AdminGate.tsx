import { useRef, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ADMIN_CODE = "0609";
const HOLD_MS = 5000;

interface Props {
  children: ReactNode;
  className?: string;
}

export function AdminGate({ children, className }: Props) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | null>(null);
  const interval = useRef<number | null>(null);
  const navigate = useNavigate();

  const start = () => {
    if (timer.current) return;
    const startedAt = Date.now();
    interval.current = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - startedAt) / HOLD_MS);
      setProgress(p);
    }, 50);
    timer.current = window.setTimeout(() => {
      setOpen(true);
      cancel();
    }, HOLD_MS);
  };

  const cancel = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
    setProgress(0);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === ADMIN_CODE) {
      setOpen(false);
      setCode("");
      navigate({ to: "/admin" });
    } else {
      toast.error("Código incorrecto");
      setCode("");
    }
  };


  return (
    <>
      <div
        className={className}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onContextMenu={(e) => e.preventDefault()}
        style={{ touchAction: "manipulation", WebkitUserSelect: "none", userSelect: "none" }}
      >
        {children}
        {progress > 0 && (
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary/15 overflow-hidden rounded-full">
            <div className="h-full bg-primary transition-[width] duration-75" style={{ width: `${progress * 100}%` }} />
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Acceso Administrador</DialogTitle>
            <DialogDescription>Ingresá el código para acceder al panel.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <Input
              autoFocus
              type="password"
              inputMode="numeric"
              placeholder="Código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button type="submit" className="w-full">Ingresar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
