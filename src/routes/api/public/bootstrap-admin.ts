import { createFileRoute } from "@tanstack/react-router";
import { bootstrapAdmin } from "@/lib/admin-bootstrap.functions";

export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as { password?: string };
        if (!body.password) {
          return new Response(JSON.stringify({ error: "password required" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        try {
          const result = await bootstrapAdmin({ data: { password: body.password } });
          return new Response(JSON.stringify(result), {
            headers: { "content-type": "application/json" },
          });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message ?? "failed" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
