import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { isAdmin } from "../../../lib/adminAuth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT update education milestone (admin protected)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { year, title, subtitle, desc, order, branches } = body;

    // Use a transaction to update education and replace branches
    const milestone = await prisma.$transaction(async (tx) => {
      // 1. Update basic education details
      const updated = await tx.education.update({
        where: { id },
        data: {
          year,
          title,
          subtitle,
          desc,
          order: order !== undefined ? Number(order) : undefined,
        },
      });

      void updated;

      // 2. If branches array is supplied, replace all of them
      if (branches && Array.isArray(branches)) {
        // Delete all old branches first
        await tx.branch.deleteMany({
          where: { educationId: id },
        });

        // Insert new ones
        if (branches.length > 0) {
          await tx.branch.createMany({
            data: branches.map((b: { label?: string; desc?: string }) => ({
              educationId: id,
              label: b.label || "",
              desc: b.desc || "",
            })),
          });
        }
      }

      // Fetch the fully updated entity
      return tx.education.findUnique({
        where: { id },
        include: { branches: true },
      });
    });

    return NextResponse.json(milestone);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update education milestone";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE education milestone (admin protected)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.education.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete education milestone";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
