import { prisma } from "@/lib/db";
import type { MatchGroup, GroupMember } from "@prisma/client";

export type MatchedGroup = MatchGroup & { members: GroupMember[] };

export async function runMatching(): Promise<MatchedGroup[]> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const available = await prisma.availability.findMany({
    where: {
      isAvailable: true,
      date: { gte: todayStart, lte: todayEnd },
    },
    include: {
      user: { include: { sportPreferences: true } },
    },
  });

  // Map sport → unique userIds
  const bySport = new Map<string, Set<string>>();
  for (const slot of available) {
    for (const pref of slot.user.sportPreferences) {
      if (!bySport.has(pref.sport)) bySport.set(pref.sport, new Set());
      bySport.get(pref.sport)!.add(slot.userId);
    }
  }

  const MIN_GROUP_SIZE: Record<string, number> = {
    football: 10,
    basketball: 6,
    tennis: 2,
  };

  const createdGroups: MatchedGroup[] = [];

  for (const [sport, userIds] of bySport) {
    const min = MIN_GROUP_SIZE[sport] ?? 2;
    if (userIds.size < min) continue;

    const timeSlot = todayStart;
    const group = await prisma.matchGroup.create({
      data: {
        sport,
        timeSlot,
        status: "open",
      },
    });

    const ids = Array.from(userIds);
    const captainIndex = Math.floor(Math.random() * ids.length);

    const members = await prisma.$transaction(
      ids.map((userId, i) =>
        prisma.groupMember.create({
          data: {
            groupId: group.id,
            userId,
            role: i === captainIndex ? "captain" : "member",
          },
        })
      )
    );

    createdGroups.push({ ...group, members });
  }

  return createdGroups;
}
