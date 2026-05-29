import { PrismaClient } from "../../prisma/client/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function createPrismaClient() {
  const dbUrl = `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
  console.log("createPrismaClient: Initializing with URL:", dbUrl);
  const adapter = new PrismaLibSql({
    url: dbUrl,
  });
  console.log("createPrismaClient: Adapter instantiated.");
  return new PrismaClient({
    adapter,
  } as ConstructorParameters<typeof PrismaClient>[0]);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

