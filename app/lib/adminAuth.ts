import { NextRequest } from "next/server";

export function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_auth");
  return cookie?.value === process.env.ADMIN_PASSWORD;
}
