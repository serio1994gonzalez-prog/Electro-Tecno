import { createFileRoute } from "@tanstack/react-router";
import { bootstrapAdmin } from "@/lib/admin-bootstrap.functions";

export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const result = await bootstrapAdmin();
          return new Response(JSON.stringify(result), {
            headers: { "content-type": "application/json" },
          });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "failed";
          return new Response(JSON.stringify({ error: msg }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
      },
      GET: async () => {
        try {
          const result = await bootstrapAdmin();
          return new Response(JSON.stringify(result), {
            headers: { "content-type": "application/json" },
          });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "failed";
          return new Response(JSON.stringify({ error: msg }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
