import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { isAdmin } from "../../../lib/adminAuth";

// PUT update tech category with items (admin protected)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { label, order, items } = body;

    // Delete all existing items and recreate
    await prisma.techItem.deleteMany({ where: { categoryId: id } });

    const category = await prisma.techCategory.update({
      where: { id },
      data: {
        label,
        order: order !== undefined ? Number(order) : 0,
        items:
          items && Array.isArray(items)
            ? { create: items.map((name: string) => ({ name })) }
            : undefined,
      },
      include: { items: { orderBy: { name: "asc" } } },
    });

    return NextResponse.json(category);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update tech category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE tech category (admin protected)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.techCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete tech category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
