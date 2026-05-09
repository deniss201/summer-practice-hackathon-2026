"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SportPreference {
  id: string;
  sport: string;
  skill: string;
}

interface TodayAvailability {
  id: string;
  isAvailable: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  location: string | null;
  sportPreferences: SportPreference[];
  todayAvailability: TodayAvailability | null;
}

interface GroupMember {
  id: string;
  userId: string;
  role: string;
}

interface MatchGroup {
  id: string;
  sport: string;
  members: GroupMember[];
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [toggling, setToggling] = useState(false);

  const [groups, setGroups] = useState<MatchGroup[] | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  // userId → name map for resolving member names
  const [nameMap, setNameMap] = useState<Record<string, string>>({});

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const fetchUser = useCallback(async (id: string) => {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) return null;
    return (await res.json()) as UserProfile;
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      router.replace("/");
      return;
    }

    setLoadingUser(true);
    fetchUser(id)
      .then((data) => {
        if (!data) {
          localStorage.removeItem("userId");
          router.replace("/");
          return;
        }
        setUser(data);
        setNameMap((prev) => ({ ...prev, [data.id]: data.name }));
      })
      .finally(() => setLoadingUser(false));
  }, [router, fetchUser]);

  async function resolveNames(memberIds: string[]) {
    const unknown = memberIds.filter((id) => !(id in nameMap));
    if (unknown.length === 0) return;

    const results = await Promise.allSettled(
      unknown.map((id) =>
        fetch(`/api/users/${id}`)
          .then((r) => r.json())
          .then((u: UserProfile) => ({ id, name: u.name }))
      )
    );

    const additions: Record<string, string> = {};
    for (const r of results) {
      if (r.status === "fulfilled") {
        additions[r.value.id] = r.value.name;
      }
    }
    setNameMap((prev) => ({ ...prev, ...additions }));
  }

  async function handleToggle() {
    if (!userId || !user) return;
    setToggling(true);
    try {
      const isIn = user.todayAvailability?.isAvailable === true;
      await fetch("/api/availability", {
        method: isIn ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const updated = await fetchUser(userId);
      if (updated) setUser(updated);
    } finally {
      setToggling(false);
    }
  }

  async function handleFindGroup() {
    setMatchLoading(true);
    setGroups(null);
    try {
      const res = await fetch("/api/match/run", { method: "POST" });
      const data = await res.json();
      const matched: MatchGroup[] = data.groups ?? [];
      setGroups(matched);

      const allMemberIds = matched.flatMap((g) =>
        g.members.map((m) => m.userId)
      );
      await resolveNames(allMemberIds);
    } finally {
      setMatchLoading(false);
    }
  }

  function handleSignOut() {
    localStorage.removeItem("userId");
    router.push("/");
  }

  if (loadingUser) {
    return (
      <main className="max-w-lg mx-auto p-8">
        <p className="text-sm text-gray-600">Loading…</p>
      </main>
    );
  }

  if (!user) return null;

  const isAvailableToday = user.todayAvailability?.isAvailable === true;

  return (
    <main className="max-w-lg mx-auto p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          {user.location && (
            <p className="text-sm text-gray-600">{user.location}</p>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 border border-gray-300 px-3 py-1"
        >
          Sign out
        </button>
      </div>

      {/* Sport preferences */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">Your Sports</h2>
        {user.sportPreferences.length === 0 ? (
          <p className="text-sm text-gray-500">No sports added</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {user.sportPreferences.map((sp) => (
              <li key={sp.id} className="text-sm">
                {sp.sport}{" "}
                <span className="text-gray-500">— {sp.skill}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Availability toggle */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">Today&apos;s Availability</h2>
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`p-2 text-sm font-medium border disabled:opacity-50 ${
            isAvailableToday
              ? "border-gray-800 bg-gray-800 text-white"
              : "border-gray-400"
          }`}
        >
          {toggling
            ? "Updating…"
            : isAvailableToday
            ? "You're IN today ✓"
            : "ShowUp Today"}
        </button>
      </section>

      {/* Match groups */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Group Matching</h2>
        <button
          onClick={handleFindGroup}
          disabled={matchLoading}
          className="border border-gray-400 p-2 text-sm font-medium disabled:opacity-50"
        >
          {matchLoading ? "Finding groups…" : "Find My Group"}
        </button>

        {groups !== null && (
          <div className="flex flex-col gap-4 mt-2">
            {groups.length === 0 ? (
              <p className="text-sm text-gray-500">
                No matches yet — check back later
              </p>
            ) : (
              groups.map((group) => (
                <div key={group.id} className="border border-gray-300 p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {group.sport}
                    </span>
                    <span className="text-sm text-gray-500">
                      {group.members.length}{" "}
                      {group.members.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {group.members.map((m) => (
                      <li key={m.id} className="text-sm flex items-center gap-2">
                        <span>{nameMap[m.userId] ?? m.userId}</span>
                        {m.role === "captain" && (
                          <span className="text-xs text-gray-500 border border-gray-400 px-1">
                            captain
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}
