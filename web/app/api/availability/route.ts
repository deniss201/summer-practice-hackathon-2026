import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function toMidnight(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

function today(): Date {
  return toMidnight(new Date());
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const userId: string | undefined = body?.userId;
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const date = body?.date ? toMidnight(new Date(body.date)) : today();

  const availability = await prisma.availability.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, isAvailable: true },
    update: { isAvailable: true },
  });

  return NextResponse.json(availability, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const userId: string | undefined = body?.userId;
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const date = today();

  const availability = await prisma.availability.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, isAvailable: false },
    update: { isAvailable: false },
  });

  return NextResponse.json(availability, { status: 200 });
}
