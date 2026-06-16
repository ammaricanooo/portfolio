import { NextRequest } from "next/server";
import { createHash } from "crypto";

function hashToken(input: string): string {
  return createHash("sha256").update(input + process.env.ADMIN_PASSWORD).digest("hex");
}

export function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_auth");
  if (!cookie?.value || !process.env.ADMIN_PASSWORD) return false;
  return cookie.value === hashToken(process.env.ADMIN_PASSWORD);
}
