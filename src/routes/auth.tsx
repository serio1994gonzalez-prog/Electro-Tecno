import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso · Mayorista Vico" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);
    if (error) {
      toast.error("Credenciales inválidas");
      return;
    }
    toast.success("Bienvenido");
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="size-4" /> Volver a la tienda
        </Link>
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Lock className="size-4" />
            </div>
            <div>
              <h1 className="font-semibold tracking-tight">Acceso administrador</h1>
              <p className="text-xs text-muted-foreground">Ingresá con tu cuenta</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-3 mt-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin mr-2" />}
              Ingresar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
