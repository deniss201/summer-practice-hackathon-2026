import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const groups = await prisma.matchGroup.findMany({
    where: { status: "open" },
    include: {
      members: {
        include: { user: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const result = groups.map((g) => {
    const captain = g.members.find((m) => m.role === "captain");
    return {
      id: g.id,
      sport: g.sport,
      description: g.description,
      memberCount: g.members.length,
      captainName: captain?.user?.name ?? "Unknown",
    };
  });

  return NextResponse.json(result);
}
