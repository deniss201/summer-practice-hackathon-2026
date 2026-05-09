"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SPORTS = ["football", "basketball", "tennis", "running"] as const;
type Sport = (typeof SPORTS)[number];
const SKILL_LEVELS = ["beginner", "intermediate", "advanced"] as const;
type SkillLevel = (typeof SKILL_LEVELS)[number];

export default function OnboardingPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("beginner");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [selectedSports, setSelectedSports] = useState<
    Partial<Record<Sport, SkillLevel>>
  >({});
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      router.replace("/dashboard");
    }
  }, [router]);

  function toggleSport(sport: Sport, checked: boolean) {
    setSelectedSports((prev) => {
      const next = { ...prev };
      if (checked) {
        next[sport] = "beginner";
      } else {
        delete next[sport];
      }
      return next;
    });
  }

  function setSportSkill(sport: Sport, skill: SkillLevel) {
    setSelectedSports((prev) => ({ ...prev, [sport]: skill }));
  }

  async function handleDetectSports() {
    if (!bio.trim()) return;
    setDetecting(true);
    try {
      const res = await fetch("/api/ai/detect-sports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.sports)) return;

      setSelectedSports((prev) => {
        const next = { ...prev };
        for (const { sport, skill } of data.sports) {
          if (SPORTS.includes(sport as Sport)) {
            next[sport as Sport] = SKILL_LEVELS.includes(skill as SkillLevel)
              ? (skill as SkillLevel)
              : "beginner";
          }
        }
        return next;
      });
    } finally {
      setDetecting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const sports = Object.entries(selectedSports).map(([sport, skill]) => ({
      sport,
      skill,
    }));

    setSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, skillLevel, location, bio, sports }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create account");
        return;
      }

      localStorage.setItem("userId", data.id);
      router.push("/dashboard");
    } catch {
      setError("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">ShowUp2Move — Get Started</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-400 p-2 text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 p-2 text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Skill Level</label>
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
            className="border border-gray-400 p-2 text-sm w-full"
          >
            {SKILL_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-400 p-2 text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Bio</label>
            <button
              type="button"
              onClick={handleDetectSports}
              disabled={detecting || !bio.trim()}
              className="text-xs border border-gray-400 px-2 py-1 disabled:opacity-40"
            >
              {detecting ? "Detecting…" : "Detect my sports ✨"}
            </button>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell us about yourself and your sports background…"
            className="border border-gray-400 p-2 text-sm w-full resize-none"
          />
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium mb-1">Sports</legend>
          {SPORTS.map((sport) => {
            const checked = sport in selectedSports;
            return (
              <div key={sport} className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm w-32">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => toggleSport(sport, e.target.checked)}
                  />
                  {sport}
                </label>
                {checked && (
                  <select
                    value={selectedSports[sport]}
                    onChange={(e) =>
                      setSportSkill(sport, e.target.value as SkillLevel)
                    }
                    className="border border-gray-400 p-1 text-sm"
                  >
                    {SKILL_LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </fieldset>

        {error && <p className="text-sm text-gray-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="border border-gray-800 p-2 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Join ShowUp2Move"}
        </button>
      </form>
    </main>
  );
}
