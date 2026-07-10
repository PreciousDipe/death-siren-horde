#!/usr/bin/env node
/**
 * One-click production verification.
 *
 * Runs read-only + destructive checks against the deployed site using the
 * public Supabase Data API and reports pass/fail for:
 *   - Admin CRUD (players, news, tournament_meta) — requires admin credentials
 *   - Audit log writes
 *   - Contact form insert + honeypot behavior
 *
 * Usage:
 *   node scripts/verify-production.mjs
 *
 * Env (all optional except the Supabase URL/key which are read from .env):
 *   SITE_URL           default https://death-siren-horde.lovable.app
 *   SUPABASE_URL       default from VITE_SUPABASE_URL
 *   SUPABASE_ANON_KEY  default from VITE_SUPABASE_PUBLISHABLE_KEY
 *   ADMIN_EMAIL        admin login (skip admin CRUD tests if unset)
 *   ADMIN_PASSWORD     admin password
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- env loading -----------------------------------------------------------
function loadDotEnv() {
  try {
    const raw = readFileSync(resolve(__dirname, "../.env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      const [, k, v] = m;
      if (!process.env[k]) process.env[k] = v.replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env — fine */
  }
}
loadDotEnv();

const SITE_URL = process.env.SITE_URL || "https://death-siren-horde.lovable.app";
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_KEY (or VITE_ equivalents in .env)");
  process.exit(2);
}

// --- test harness ----------------------------------------------------------
const results = [];
async function test(name, fn) {
  const started = Date.now();
  try {
    await fn();
    const ms = Date.now() - started;
    results.push({ name, ok: true, ms });
    console.log(`  ✓ ${name} (${ms}ms)`);
  } catch (err) {
    const ms = Date.now() - started;
    const msg = err instanceof Error ? err.message : String(err);
    results.push({ name, ok: false, ms, msg });
    console.log(`  ✗ ${name} (${ms}ms)\n      ${msg}`);
  }
}
function section(title) {
  console.log(`\n▸ ${title}`);
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// --- clients ---------------------------------------------------------------
const anon = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
let admin = null; // authenticated admin client
let adminUserId = null;

// ---------------------------------------------------------------------------
console.log(`Verifying ${SITE_URL}`);
console.log(`Supabase: ${SUPABASE_URL}`);

section("Site reachability");
await test("Homepage returns 200", async () => {
  const res = await fetch(SITE_URL, { redirect: "follow" });
  assert(res.ok, `status ${res.status}`);
  const html = await res.text();
  assert(html.length > 500, "homepage HTML suspiciously small");
});
await test("/contact returns 200", async () => {
  const res = await fetch(`${SITE_URL}/contact`, { redirect: "follow" });
  assert(res.ok, `status ${res.status}`);
});

section("Public reads (RLS + GRANTs)");
for (const table of ["players", "news_items", "tournament_meta", "site_settings"]) {
  await test(`SELECT public.${table}`, async () => {
    const { error } = await anon.from(table).select("*").limit(1);
    assert(!error, error?.message);
  });
}

section("Contact form (honeypot policy)");
await test("Insert valid contact message", async () => {
  const { error } = await anon.from("contact_messages").insert({
    name: "Verify Bot",
    email: `verify+${Date.now()}@example.com`,
    role: null,
    ign: null,
    message: `Automated verification at ${new Date().toISOString()}`,
  });
  assert(!error, error?.message);
});
await test("Anon cannot read contact_messages", async () => {
  const { data, error } = await anon.from("contact_messages").select("id").limit(1);
  // Either RLS blocks (error) or returns empty — both acceptable
  assert(error || (Array.isArray(data) && data.length === 0), "anon should not read messages");
});

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  section("Admin CRUD");
  console.log("  ⚠ ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin CRUD tests");
} else {
  section("Admin login");
  admin = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  await test("Sign in as admin", async () => {
    const { data, error } = await admin.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    assert(!error, error?.message);
    adminUserId = data.user?.id;
    assert(adminUserId, "no user id after login");
  });
  await test("Admin has 'admin' role", async () => {
    const { data, error } = await admin.rpc("has_role", {
      _user_id: adminUserId,
      _role: "admin",
    });
    assert(!error, error?.message);
    assert(data === true, "user is not admin");
  });

  // ---- Players CRUD ------------------------------------------------------
  section("Admin CRUD — players");
  let playerId;
  const tag = `verify-${Date.now()}`;
  await test("CREATE player", async () => {
    const { data, error } = await admin
      .from("players")
      .insert({ ign: tag, role: "Marksman", squad: "Darkstar", sort_order: 999 })
      .select()
      .single();
    assert(!error, error?.message);
    playerId = data.id;
  });
  await test("UPDATE player", async () => {
    const { error } = await admin
      .from("players")
      .update({ real_name: "Verified" })
      .eq("id", playerId);
    assert(!error, error?.message);
  });
  await test("DELETE player", async () => {
    const { error } = await admin.from("players").delete().eq("id", playerId);
    assert(!error, error?.message);
  });
  await test("Audit log recorded 3 player events", async () => {
    const { data, error } = await admin
      .from("audit_logs")
      .select("action")
      .eq("record_id", playerId)
      .eq("table_name", "players");
    assert(!error, error?.message);
    const actions = (data || []).map((r) => r.action).sort();
    assert(
      actions.length >= 3,
      `expected >=3 audit rows, got ${actions.length}: ${actions.join(",")}`,
    );
  });

  // ---- News CRUD ---------------------------------------------------------
  section("Admin CRUD — news");
  let newsId;
  await test("CREATE news item", async () => {
    const { data, error } = await admin
      .from("news_items")
      .insert({
        title: `Verify ${tag}`,
        date: new Date().toISOString().slice(0, 10),
        category: "Test",
        sort_order: 999,
      })
      .select()
      .single();
    assert(!error, error?.message);
    newsId = data.id;
  });
  await test("UPDATE news item", async () => {
    const { error } = await admin
      .from("news_items")
      .update({ content: "verified" })
      .eq("id", newsId);
    assert(!error, error?.message);
  });
  await test("DELETE news item", async () => {
    const { error } = await admin.from("news_items").delete().eq("id", newsId);
    assert(!error, error?.message);
  });

  // ---- Tournament meta CRUD ---------------------------------------------
  section("Admin CRUD — tournaments");
  let tournamentId;
  await test("CREATE tournament_meta", async () => {
    const { data, error } = await admin
      .from("tournament_meta")
      .insert({
        name: `Verify ${tag}`,
        tag: "TEST",
        target_date: new Date(Date.now() + 86_400_000).toISOString(),
        is_active: false,
      })
      .select()
      .single();
    assert(!error, error?.message);
    tournamentId = data.id;
  });
  await test("UPDATE tournament_meta", async () => {
    const { error } = await admin
      .from("tournament_meta")
      .update({ tag: "UPD" })
      .eq("id", tournamentId);
    assert(!error, error?.message);
  });
  await test("DELETE tournament_meta", async () => {
    const { error } = await admin
      .from("tournament_meta")
      .delete()
      .eq("id", tournamentId);
    assert(!error, error?.message);
  });

  await admin.auth.signOut().catch(() => {});
}

// --- summary --------------------------------------------------------------
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);
console.log(
  `\n────────────────────────────────────────\nResults: ${passed}/${results.length} passed`,
);
if (failed.length) {
  console.log(`Failed:`);
  for (const f of failed) console.log(`  ✗ ${f.name} — ${f.msg}`);
  process.exit(1);
}
console.log("All checks passed ✅");
