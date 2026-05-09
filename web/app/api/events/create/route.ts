import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { userId, sport, description } = body ?? {};

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  if (!sport || typeof sport !== "string") {
    return NextResponse.json({ error: "sport is required" }, { status: 400 });
  }

  const group = await prisma.$transaction(async (tx) => {
    const created = await tx.matchGroup.create({
      data: {
        sport,
        description: description ?? null,
        timeSlot: new Date(),
        status: "open",
      },
    });

    await tx.groupMember.create({
      data: { groupId: created.id, userId, role: "captain" },
    });

    return tx.matchGroup.findUniqueOrThrow({
      where: { id: created.id },
      include: { members: true, event: true },
    });
  });

  return NextResponse.json(group, { status: 201 });
}
