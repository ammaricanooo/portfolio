import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/adminAuth";

// GET all education milestones ordered by order with branches
export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: { order: "asc" },
      include: {
        branches: true,
      },
    });
    return NextResponse.json(education);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch education";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create education milestone (admin protected)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { year, title, subtitle, desc, order, branches } = body;

    if (!year || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create education milestone with optional nested branches in a transaction
    const milestone = await prisma.education.create({
      data: {
        year,
        title,
        subtitle: subtitle || "",
        desc: desc || "",
        order: order !== undefined ? Number(order) : 0,
        branches: branches && Array.isArray(branches) ? {
          create: branches.map((b: { label?: string; desc?: string }) => ({
            label: b.label || "",
            desc: b.desc || "",
          })),
        } : undefined,
      },
      include: {
        branches: true,
      },
    });

    return NextResponse.json(milestone);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create education milestone";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
