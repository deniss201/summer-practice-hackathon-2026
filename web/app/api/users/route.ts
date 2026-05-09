import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email || email.trim().length === 0) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim() },
    include: { sportPreferences: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

interface SportInput {
  sport: string;
  skill: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, email, avatar, skillLevel, location, sports } = body ?? {};

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
        avatar: avatar ?? null,
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
