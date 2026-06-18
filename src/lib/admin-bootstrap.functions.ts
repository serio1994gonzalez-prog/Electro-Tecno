import { createServerFn } from "@tanstack/react-start";

const ADMIN_EMAIL = "control@admin.com";
const ADMIN_PASSWORD = "admin vico 123";

/**
 * Idempotent bootstrap: ensures the canonical admin user exists with the
 * configured email/password and has the 'admin' role. Safe to call multiple
 * times — it will reset the password to the configured value and remove
 * any other admins.
 */
export const bootstrapAdmin = createServerFn({ method: "POST" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

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
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      if (updErr) throw updErr;
    } else {
      const { data: created, error: cErr } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      if (cErr) throw cErr;
      userId = created.user!.id;
    }

    // Drop any pre-existing admin roles (other accounts) and grant to this user
    await supabaseAdmin.from("user_roles").delete().eq("role", "admin");
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (roleErr) throw roleErr;

    return { ok: true, email: ADMIN_EMAIL };
  });
