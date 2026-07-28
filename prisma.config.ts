import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    // For CLI commands (db push, migrate), point to local SQLite.
    // The actual Turso connection is handled by the adapter in prisma.ts at runtime.
    url: "file:./prisma/dev.db",
  },
});
