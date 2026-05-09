import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: groupId } = await params;
  const body = await req.json().catch(() => null);
  const { userId } = body ?? {};

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const group = await prisma.matchGroup.findUnique({
    where: { id: groupId },
    include: { members: true },
  });

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }
  if (group.status !== "open") {
    return NextResponse.json({ error: "Group is not open" }, { status: 400 });
  }
  if (group.members.some((m) => m.userId === userId)) {
    return NextResponse.json({ error: "Already a member" }, { status: 409 });
  }

  await prisma.groupMember.create({
    data: { groupId, userId, role: "member" },
  });

  const updated = await prisma.matchGroup.findUniqueOrThrow({
    where: { id: groupId },
    include: { members: true, event: true },
  });

  return NextResponse.json(updated);
}
