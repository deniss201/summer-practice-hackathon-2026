import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { groupId, venue, time } = body ?? {};

  if (!groupId || typeof groupId !== "string") {
    return NextResponse.json({ error: "groupId is required" }, { status: 400 });
  }
  if (!venue || typeof venue !== "string") {
    return NextResponse.json({ error: "venue is required" }, { status: 400 });
  }
  if (!time) {
    return NextResponse.json({ error: "time is required" }, { status: 400 });
  }

  const group = await prisma.matchGroup.findUnique({ where: { id: groupId } });
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const [event] = await prisma.$transaction([
    prisma.event.upsert({
      where: { groupId },
      create: { groupId, venue, time: new Date(time) },
      update: { venue, time: new Date(time) },
    }),
    prisma.matchGroup.update({
      where: { id: groupId },
      data: { status: "confirmed" },
    }),
  ]);

  return NextResponse.json(event, { status: 201 });
}
