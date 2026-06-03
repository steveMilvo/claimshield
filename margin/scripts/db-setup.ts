/**
 * Initialise the Postgres database: create the schema (idempotent) and seed the
 * demo class. Run once after pointing DATABASE_URL at a fresh database.
 *
 *   DATABASE_URL=postgres://… npm run db:setup
 *
 * Schema creation also happens lazily at runtime, so this is a convenience /
 * verification step rather than a hard requirement.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Load .env.local the way Next does, so DATABASE_URL can live there.
const envPath = join(ROOT, ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("\n  DATABASE_URL is not set. Add it to .env.local or the environment.\n");
    process.exit(1);
  }
  const { pgDriver } = await import("../src/lib/server/storePg");
  console.log("  Creating schema + seeding default class…");
  await pgDriver.seedIfEmpty();
  const cls = await pgDriver.getClass("cls_8e");
  const students = await pgDriver.listClassStudents("cls_8e");
  console.log(`  ✓ Class: ${cls?.name} (${cls?.teacherName})`);
  console.log(`  ✓ Students: ${students.map((s) => s.displayName).join(", ")}`);
  console.log("  Done.\n");
  process.exit(0);
}

main().catch((e) => {
  console.error("db:setup failed:", e);
  process.exit(1);
});
