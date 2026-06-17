import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/adminAuth";

// GET all tech categories with items
export async function GET() {
  try {
    const categories = await prisma.techCategory.findMany({
      orderBy: { order: "asc" },
      include: { items: { orderBy: { name: "asc" } } },
    });
    return NextResponse.json(categories);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch tech categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create tech category with items (admin protected)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { label, order, items } = body;

    if (!label) {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }

    const category = await prisma.techCategory.create({
      data: {
        label,
        order: order !== undefined ? Number(order) : 0,
        items: items && Array.isArray(items)
          ? {
              create: items.map((name: string) => ({ name })),
            }
          : undefined,
      },
      include: { items: true },
    });

    return NextResponse.json(category);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create tech category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
