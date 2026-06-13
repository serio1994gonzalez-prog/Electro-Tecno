import { createServerFn } from "@tanstack/react-start";

const ADMIN_EMAIL = "sergiodanielgonzalez1994@gmail.com";

/**
 * One-shot bootstrap: creates the canonical admin user with the given
 * password and grants the 'admin' role. Refuses to run if an admin
 * already exists, so this endpoint is safe to leave in the codebase.
 */
export const bootstrapAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => {
    if (!data || typeof data.password !== "string" || data.password.length < 8) {
      throw new Error("Invalid password");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Refuse if any admin already exists
    const { count, error: cntErr } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (cntErr) throw cntErr;
    if ((count ?? 0) > 0) {
      throw new Error("Admin already provisioned");
    }

    // Find or create the user
    let userId: string;
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listErr) throw listErr;
    const existing = list.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL);
    if (existing) {
      userId = existing.id;
      const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password: data.password,
        email_confirm: true,
      });
      if (updErr) throw updErr;
    } else {
      const { data: created, error: cErr } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: data.password,
        email_confirm: true,
      });
      if (cErr) throw cErr;
      userId = created.user!.id;
    }

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (roleErr) throw roleErr;

    return { ok: true, email: ADMIN_EMAIL };
  });
