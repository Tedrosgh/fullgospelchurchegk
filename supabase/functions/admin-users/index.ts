import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const publishableKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authorization = request.headers.get("Authorization") || "";
    const callerClient = createClient(supabaseUrl, publishableKey, {
      global: { headers: { Authorization: authorization } },
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: { user: caller }, error: callerError } = await callerClient.auth.getUser();
    if (callerError || !caller) return json({ message: "Authentication required." }, 401);

    const [{ data: bootstrapAdmin }, { data: assignedAdmin }] = await Promise.all([
      adminClient.from("church_admins").select("user_id").eq("user_id", caller.id).maybeSingle(),
      adminClient.from("user_access").select("app_role").eq("user_id", caller.id).eq("app_role", "admin").maybeSingle(),
    ]);
    if (!bootstrapAdmin && !assignedAdmin) return json({ message: "Administrator access required." }, 403);

    if (request.method === "GET") {
      const { data: authPage, error } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (error) throw error;
      const [{ data: accessRows, error: accessError }, { data: teamRows, error: teamError }] = await Promise.all([
        adminClient.from("user_access").select("*"),
        adminClient.from("user_team_roles").select("user_id, team, access_level"),
      ]);
      if (accessError) throw accessError;
      if (teamError) throw teamError;
      const access = new Map((accessRows || []).map((row) => [row.user_id, row]));
      const teams = new Map<string, Record<string, string>>();
      for (const row of teamRows || []) teams.set(row.user_id, { ...(teams.get(row.user_id) || {}), [row.team]: row.access_level });
      return json({ users: authPage.users.map((user) => ({
        id: user.id,
        email: user.email,
        fullName: access.get(user.id)?.full_name || user.user_metadata?.full_name || "",
        role: access.get(user.id)?.app_role || "member",
        financeAccess: Boolean(access.get(user.id)?.finance_access),
        teamRoles: teams.get(user.id) || {},
        confirmed: Boolean(user.email_confirmed_at),
        createdAt: user.created_at,
      })) });
    }

    const body = await request.json();
    const role = ["member", "editor", "admin"].includes(body.role) ? body.role : "member";
    if (request.method === "POST") {
      if (!body.email || !body.password || body.password.length < 8) {
        return json({ message: "Email and a temporary password of at least 8 characters are required." }, 400);
      }
      const { data, error } = await adminClient.auth.admin.createUser({
        email: String(body.email).trim().toLowerCase(),
        password: body.password,
        email_confirm: Boolean(body.emailConfirmed),
        user_metadata: { full_name: String(body.fullName || "").trim() },
      });
      if (error) throw error;
      const { error: accessError } = await adminClient.from("user_access").upsert({
        user_id: data.user.id,
        email: data.user.email,
        full_name: String(body.fullName || "").trim(),
        app_role: role,
        finance_access: Boolean(body.financeAccess),
        updated_at: new Date().toISOString(),
      });
      if (accessError) throw accessError;
      if (body.team && body.teamRole) {
        const { error: teamError } = await adminClient.from("user_team_roles").upsert({ user_id: data.user.id, team: body.team, access_level: body.teamRole, updated_at: new Date().toISOString() });
        if (teamError) throw teamError;
      }
      return json({ message: "User created.", id: data.user.id }, 201);
    }

    if (request.method === "PATCH") {
      if (!body.id) return json({ message: "User id is required." }, 400);
      const { error } = await adminClient.from("user_access").upsert({
        user_id: body.id,
        email: String(body.email || "").trim().toLowerCase(),
        full_name: String(body.fullName || "").trim(),
        app_role: role,
        finance_access: Boolean(body.financeAccess),
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      const teamRoles = body.teamRoles || {};
      const { error: deleteError } = await adminClient.from("user_team_roles").delete().eq("user_id", body.id);
      if (deleteError) throw deleteError;
      const assignments = Object.entries(teamRoles).filter(([, level]) => ["viewer", "editor", "manager"].includes(String(level))).map(([team, access_level]) => ({ user_id: body.id, team, access_level, updated_at: new Date().toISOString() }));
      if (assignments.length) {
        const { error: teamError } = await adminClient.from("user_team_roles").insert(assignments);
        if (teamError) throw teamError;
      }
      return json({ message: "User permissions updated." });
    }

    return json({ message: "Method not allowed." }, 405);
  } catch (error) {
    return json({ message: error instanceof Error ? error.message : "User operation failed." }, 400);
  }
});
