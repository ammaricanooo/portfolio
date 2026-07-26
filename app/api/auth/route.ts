import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { isAdmin } from "../../lib/adminAuth";

function hashToken(input: string): string {
  return createHash("sha256").update(input + process.env.ADMIN_PASSWORD).digest("hex");
}

export async function GET(req: NextRequest) {
  if (isAdmin(req)) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", hashToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin_auth");
  return res;
}
