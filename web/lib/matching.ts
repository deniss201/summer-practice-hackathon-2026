import { prisma } from "@/lib/db";
import type { MatchGroup, GroupMember } from "@prisma/client";

export type MatchedGroup = MatchGroup & { members: GroupMember[] };

export async function runMatching(): Promise<MatchedGroup[]> {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(todayStart.getHours() - 24);
  const todayEnd = new Date(now);
  todayEnd.setHours(todayEnd.getHours() + 24);

  const available = await prisma.availability.findMany({
    where: {
      isAvailable: true,
      date: { gte: todayStart, lte: todayEnd },
    },
    include: {
      user: { include: { sportPreferences: true } },
    },
  });

  console.log("[matching] availability records found:", available.length);

  // Map sport → unique userIds
  const bySport = new Map<string, Set<string>>();
  for (const slot of available) {
    for (const pref of slot.user.sportPreferences) {
      if (!bySport.has(pref.sport)) bySport.set(pref.sport, new Set());
      bySport.get(pref.sport)!.add(slot.userId);
    }
  }

  console.log("[matching] users per sport:", Object.fromEntries(
    Array.from(bySport.entries()).map(([sport, ids]) => [sport, ids.size])
  ));

  const MIN_GROUP_SIZE: Record<string, number> = {
    football: 4,
    basketball: 2,
    tennis: 2,
  };

  const affectedGroups: MatchedGroup[] = [];

  for (const [sport, userIds] of bySport) {
    const min = MIN_GROUP_SIZE[sport] ?? 2;
    if (userIds.size < min) continue;

    // Reuse an existing open group for this sport if one exists
    const existing = await prisma.matchGroup.findFirst({
      where: { sport, status: "open" },
      include: { members: true },
    });

    if (existing) {
      const alreadyIn = new Set(existing.members.map((m) => m.userId));
      const toAdd = Array.from(userIds).filter((id) => !alreadyIn.has(id));

      let members = existing.members;
      if (toAdd.length > 0) {
        const newMembers = await prisma.$transaction(
          toAdd.map((userId) =>
            prisma.groupMember.create({
              data: { groupId: existing.id, userId, role: "member" },
            })
          )
        );
        members = [...members, ...newMembers];
      }

      affectedGroups.push({ ...existing, members });
    } else {
      // No open group for this sport yet — create one
      const group = await prisma.matchGroup.create({
        data: { sport, timeSlot: now, status: "open" },
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

      affectedGroups.push({ ...group, members });
    }
  }

  return affectedGroups;
}
