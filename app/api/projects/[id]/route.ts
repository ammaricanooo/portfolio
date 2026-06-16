import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { isAdmin } from "../../../lib/adminAuth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT update project (admin protected)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, tech, url, year, desc, img, order } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        tech,
        url,
        year,
        desc,
        img,
        order: order !== undefined ? Number(order) : undefined,
      },
    });

    return NextResponse.json(project);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE project (admin protected)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
