import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/adminAuth";

// GET all projects ordered by order
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("GET projects error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch projects" }, { status: 500 });
  }
}

// POST create project (admin protected)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, tech, url, year, desc, img, order } = body;

    if (!title || !tech || !year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        tech,
        url: url || "#",
        year,
        desc: desc || "",
        img: img || "",
        order: order !== undefined ? Number(order) : 0,
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("POST project error:", error);
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}
