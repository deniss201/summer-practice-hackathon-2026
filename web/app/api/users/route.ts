import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface SportInput {
  sport: string;
  skill: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, email, skillLevel, location, sports } = body ?? {};

  if (!name || !email) {
    return NextResponse.json(
      { error: "name and email are required" },
      { status: 400 }
    );
  }

  const sportList: SportInput[] = Array.isArray(sports) ? sports : [];

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        name,
        email,
        skillLevel: skillLevel ?? null,
        location: location ?? null,
      },
    });

    if (sportList.length > 0) {
      await tx.sportPreference.createMany({
        data: sportList.map(({ sport, skill }) => ({
          userId: created.id,
          sport,
          skill,
        })),
      });
    }

    return tx.user.findUniqueOrThrow({
      where: { id: created.id },
      include: { sportPreferences: true },
    });
  });

  return NextResponse.json(user, { status: 201 });
}
