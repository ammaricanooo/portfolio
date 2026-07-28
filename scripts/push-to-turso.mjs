// One-time script to push schema to Turso cloud
// Run: node scripts/push-to-turso.mjs

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { config } from "dotenv";

config(); // load .env

const url   = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (!url || !token) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  process.exit(1);
}

const client = createClient({ url, authToken: token });

const statements = [
  `CREATE TABLE IF NOT EXISTS "Project" (
    "id"        TEXT PRIMARY KEY NOT NULL,
    "order"     INTEGER NOT NULL DEFAULT 0,
    "title"     TEXT NOT NULL,
    "tech"      TEXT NOT NULL,
    "url"       TEXT NOT NULL DEFAULT '#',
    "year"      TEXT NOT NULL,
    "desc"      TEXT NOT NULL DEFAULT '',
    "img"       TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "Education" (
    "id"        TEXT PRIMARY KEY NOT NULL,
    "order"     INTEGER NOT NULL DEFAULT 0,
    "year"      TEXT NOT NULL,
    "title"     TEXT NOT NULL,
    "subtitle"  TEXT NOT NULL DEFAULT '',
    "desc"      TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "Branch" (
    "id"          TEXT PRIMARY KEY NOT NULL,
    "label"       TEXT NOT NULL,
    "desc"        TEXT NOT NULL DEFAULT '',
    "educationId" TEXT NOT NULL,
    FOREIGN KEY ("educationId") REFERENCES "Education"("id") ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "TechCategory" (
    "id"        TEXT PRIMARY KEY NOT NULL,
    "order"     INTEGER NOT NULL DEFAULT 0,
    "label"     TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "TechItem" (
    "id"         TEXT PRIMARY KEY NOT NULL,
    "name"       TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    FOREIGN KEY ("categoryId") REFERENCES "TechCategory"("id") ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "SiteContent" (
    "id"        TEXT PRIMARY KEY NOT NULL,
    "key"       TEXT NOT NULL UNIQUE,
    "value"     TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
  )`,
];

console.log("Pushing schema to Turso...\n");

for (const sql of statements) {
  const tableName = sql.match(/"(\w+)"/)?.[1] ?? "unknown";
  try {
    await client.execute(sql);
    console.log(`✓ ${tableName}`);
  } catch (err) {
    console.error(`✗ ${tableName}:`, err.message);
  }
}

console.log("\nDone! Schema is now synced to Turso.");
process.exit(0);
