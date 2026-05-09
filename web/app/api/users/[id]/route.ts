import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function todayWindow() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(start.getHours() - 24);
  const end = new Date(now);
  end.setHours(end.getHours() + 24);
  return { start, end };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { start, end } = todayWindow();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      sportPreferences: true,
      availability: {
        where: { date: { gte: start, lte: end } },
        take: 1,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...user,
    todayAvailability: user.availability[0] ?? null,
    availability: undefined,
  });
}
