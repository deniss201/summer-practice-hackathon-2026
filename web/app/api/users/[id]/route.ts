import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function todayWindow() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
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
