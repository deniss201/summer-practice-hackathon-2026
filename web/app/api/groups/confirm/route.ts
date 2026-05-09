import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { groupId, userId } = body ?? {};

  if (!groupId || typeof groupId !== "string") {
    return NextResponse.json({ error: "groupId is required" }, { status: 400 });
  }
  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const member = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found in group" }, { status: 404 });
  }

  const updated = await prisma.groupMember.update({
    where: { groupId_userId: { groupId, userId } },
    data: { confirmed: true },
  });

  return NextResponse.json(updated);
}
