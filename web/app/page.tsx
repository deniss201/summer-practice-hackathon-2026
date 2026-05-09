"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SPORTS = ["football", "basketball", "tennis", "running"] as const;
type Sport = (typeof SPORTS)[number];
const SKILL_LEVELS = ["beginner", "intermediate", "advanced"] as const;
type SkillLevel = (typeof SKILL_LEVELS)[number];

const SPORT_META: Record<Sport, { tag: string; label: string; meta: string }> = {
  football:   { tag: "01", label: "Football",   meta: "11 V 11" },
  basketball: { tag: "02", label: "Basketball", meta: "5 V 5" },
  tennis:     { tag: "03", label: "Tennis",     meta: "1 V 1" },
  running:    { tag: "04", label: "Running",    meta: "SOLO / GROUP" },
};

// ── Icons ────────────────────────────────────────────────────
function IconBolt(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}
function IconSparkle(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
    </svg>
  );
}
function IconPin(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconCheck(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" {...p}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}
function IconPlus(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconArrow(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" {...p}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

// ── Logo ─────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 flex items-center justify-center text-black"
        style={{ background: "var(--volt)" }}
      >
        <IconBolt className="w-5 h-5" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display uppercase text-2xl tracker-tight leading-none">ShowUp</span>
        <span className="font-display uppercase text-2xl tracker-tight leading-none" style={{ color: "var(--volt)" }}>
          2Move
        </span>
      </div>
    </div>
  );
}

// ── Marquee ──────────────────────────────────────────────────
function TopMarquee() {
  const items = ["SHOW UP", "MOVE FAST", "PLAY HARD", "NO EXCUSES", "EVERY DAY", "STAY READY", "TRAIN MODE", "GAME ON"];
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-b" style={{ borderColor: "var(--border)" }}>
      <div className="flex whitespace-nowrap py-2 marquee-track text-[11px] font-bold tracker-wide pill-row text-neutral-500">
        {repeated.map((t, i) => (
          <span key={i} className="flex items-center gap-3 shrink-0">
            <span className="w-1 h-1 rounded-full" style={{ background: "var(--volt)" }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── FormSection ───────────────────────────────────────────────
function FormSection({
  number,
  title,
  subtitle,
  counter,
  children,
}: {
  number: string;
  title: string;
  subtitle?: string;
  counter?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16 pt-10 border-t border-neutral-900">
      <div className="grid grid-cols-12 gap-8 mb-10 items-start">
        <div className="col-span-12 md:col-span-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono-s2m text-xs" style={{ color: "var(--volt)" }}>/{number}/</span>
            <span className="w-6 h-px bg-neutral-800" />
            <span className="font-mono-s2m text-[10px] text-neutral-500 tracker-wide">SECTION</span>
            {counter && (
              <span
                className="ml-2 inline-flex items-center gap-2 text-[10px] font-mono-s2m tracker-wide px-2 py-1"
                style={{ color: "var(--volt)", border: "1px solid rgba(204,245,40,0.4)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--volt)" }} />
                {counter}
              </span>
            )}
          </div>
          <h2 className="font-display uppercase text-5xl md:text-6xl tracker-tight leading-[0.9]">{title}</h2>
        </div>
        <div className="col-span-12 md:col-span-5">
          {subtitle && (
            <div className="pl-5 py-1 mt-2" style={{ borderLeft: "2px solid var(--volt)" }}>
              <div className="font-mono-s2m text-[10px] tracker-wide text-neutral-500 mb-2">BRIEF</div>
              <p className="text-neutral-300 text-base leading-relaxed">{subtitle}</p>
            </div>
          )}
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}

// ── Field ─────────────────────────────────────────────────────
function Field({
  span = 6,
  label,
  hint,
  children,
}: {
  span?: number;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ gridColumn: `span ${span} / span ${span}` }}>
      <label className="flex items-baseline justify-between mb-2">
        <span className="font-mono-s2m text-[11px] uppercase tracker-wide text-neutral-300">{label}</span>
        {hint && <span className="font-mono-s2m text-[10px] tracker-wide text-neutral-600">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

// ── Sport card ────────────────────────────────────────────────
function SportCard({
  sport,
  selected,
  skillValue,
  onToggle,
  onSkillChange,
}: {
  sport: Sport;
  selected: boolean;
  skillValue: SkillLevel | undefined;
  onToggle: () => void;
  onSkillChange: (s: SkillLevel) => void;
}) {
  const meta = SPORT_META[sport];
  return (
    <div
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName === "SELECT") return;
        onToggle();
      }}
      className="relative border-2 overflow-hidden cursor-pointer group transition-all"
      style={{
        borderColor: selected ? "var(--volt)" : "var(--border)",
        background: "var(--surface)",
      }}
    >
      {/* Tag row */}
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="font-mono-s2m text-[10px] tracker-wide text-neutral-500">
          SPORT / {meta.tag}
        </span>
        <div
          className="w-7 h-7 flex items-center justify-center border transition-all"
          style={
            selected
              ? { background: "var(--volt)", borderColor: "var(--volt)", color: "black" }
              : { borderColor: "#404040", color: "#404040" }
          }
        >
          {selected ? <IconCheck className="w-4 h-4" /> : <IconPlus className="w-4 h-4" />}
        </div>
      </div>

      {/* Sport name */}
      <div className="px-4 pt-8 pb-6">
        <h3
          className="font-display uppercase text-5xl tracker-tight leading-[0.9] transition-colors"
          style={{ color: selected ? "var(--volt)" : "white" }}
        >
          {meta.label}
        </h3>
        <div className="mt-2 font-mono-s2m text-[11px] tracker-wide text-neutral-500">
          {meta.meta}
        </div>
      </div>

      {/* Stripe band */}
      <div className={`h-2 w-full ${selected ? "stripes-volt" : "stripes"}`} />

      {/* Skill dropdown — slides in when selected */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: selected ? "10rem" : "0", opacity: selected ? 1 : 0 }}
      >
        <div
          className="px-4 py-4 border-t"
          style={{ borderColor: "var(--border)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <label className="flex items-baseline justify-between mb-2">
            <span className="font-mono-s2m text-[10px] uppercase tracker-wide text-neutral-400">
              Your level
            </span>
            <span className="font-mono-s2m text-[10px] tracker-wide" style={{ color: "var(--volt)" }}>
              ●●●○
            </span>
          </label>
          <select
            className="athletic w-full border focus:outline-none px-3 py-2.5 text-sm"
            style={{ background: "black", borderColor: "var(--border)" }}
            value={skillValue ?? "beginner"}
            onChange={(e) => onSkillChange(e.target.value as SkillLevel)}
          >
            {SKILL_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarDragging, setAvatarDragging] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("beginner");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [selectedSports, setSelectedSports] = useState<Partial<Record<Sport, SkillLevel>>>({});
  const [detecting, setDetecting] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
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

  function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleAvatarFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    try {
      const b64 = await readFileAsBase64(file);
      setAvatar(b64);
    } catch {
      // silently ignore
    }
  }

  async function handleDetectLocation() {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
      );
      const { latitude: lat, longitude: lon } = pos.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county;
      if (city) setLocation(city);
    } catch {
      // silently ignore — user denied or timed out
    } finally {
      setDetectingLocation(false);
    }
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

    const sports = Object.entries(selectedSports).map(([sport, skill]) => ({ sport, skill }));

    setSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, avatar: avatar || null, skillLevel, location, bio, sports }),
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

  const canSubmit = !!(name && email && skillLevel && location && Object.keys(selectedSports).length > 0);

  return (
    <div className="relative z-10 min-h-screen">
      <TopMarquee />

      {/* Sticky header */}
      <header
        className="border-b sticky top-0 z-30"
        style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-[1400px] mx-auto px-10 py-5 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-6 text-xs font-bold tracker-wide text-neutral-500">
            <span className="hidden md:inline font-mono-s2m">STEP 01 / 02</span>
            <div className="w-32 h-1 bg-neutral-800 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0" style={{ width: "50%", background: "var(--volt)" }} />
            </div>
          </div>
        </div>
      </header>

      <main className="pb-24">
        {/* Hero */}
        <section className="max-w-[1400px] mx-auto px-10 pt-20 pb-14">
          <div className="grid grid-cols-12 gap-8 items-end">
            <div className="col-span-12 lg:col-span-9">
              <div className="flex items-center gap-3 mb-6 text-xs font-bold tracker-wide font-mono-s2m" style={{ color: "var(--volt)" }}>
                <span className="w-8 h-px" style={{ background: "var(--volt)" }} />
                NEW ATHLETE / PROFILE BUILD
              </div>
              <h1
                className="font-display uppercase tracker-tight leading-[0.85]"
                style={{ fontSize: "clamp(72px, 11vw, 180px)" }}
              >
                Build your
                <br />
                <span style={{ color: "var(--volt)" }}>starting</span> lineup.
              </h1>
            </div>
            <div className="col-span-12 lg:col-span-3 text-neutral-400 leading-relaxed">
              <p className="text-base">
                Tell us who you are and how you move. We&apos;ll match you with athletes
                near you who play your game, at your level — every single day.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-[1400px] mx-auto px-10">

          {/* Section I — Identity */}
          <FormSection number="I" title="Create your profile" subtitle="The basics. Your name, your turf.">
            <div className="grid grid-cols-12 gap-5">
              <Field span={6} label="Full name" hint="REQUIRED">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full border focus:outline-none px-5 py-4 text-base placeholder:text-neutral-600 transition-colors"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--volt)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </Field>
              <Field span={6} label="Email" hint="WE NEVER SPAM">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@email.com"
                  className="w-full border focus:outline-none px-5 py-4 text-base placeholder:text-neutral-600 transition-colors"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--volt)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </Field>
              <Field span={6} label="Profile photo" hint="OPTIONAL">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleAvatarFile(file);
                  }}
                />
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setAvatarDragging(true); }}
                  onDragLeave={() => setAvatarDragging(false)}
                  onDrop={async (e) => {
                    e.preventDefault();
                    setAvatarDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) await handleAvatarFile(file);
                  }}
                  className="relative w-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors overflow-hidden"
                  style={{
                    borderColor: avatarDragging ? "var(--volt)" : avatar ? "var(--volt)" : "var(--border-strong)",
                    background: avatar ? "transparent" : "var(--surface)",
                    minHeight: "140px",
                  }}
                >
                  {avatar ? (
                    <>
                      <img
                        src={avatar}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                        style={{ maxHeight: "140px" }}
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(0,0,0,0.6)" }}
                      >
                        <span className="font-mono-s2m text-[11px] tracker-wide" style={{ color: "var(--volt)" }}>
                          CHANGE PHOTO
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                      <div
                        className="w-12 h-12 border-2 border-dashed flex items-center justify-center"
                        style={{ borderColor: avatarDragging ? "var(--volt)" : "var(--border-strong)" }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" style={{ color: avatarDragging ? "var(--volt)" : "var(--muted)" }}>
                          <path d="M12 16V8m0 0-3 3m3-3 3 3" strokeLinecap="square" />
                          <rect x="3" y="3" width="18" height="18" rx="0" />
                        </svg>
                      </div>
                      <span className="font-mono-s2m text-[11px] tracker-wide leading-relaxed" style={{ color: avatarDragging ? "var(--volt)" : "var(--muted)" }}>
                        {avatarDragging ? "DROP IT →" : "DRAG & DROP YOUR PHOTO HERE\nOR CLICK TO SELECT"}
                      </span>
                    </div>
                  )}
                </div>
                {avatar && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setAvatar(""); if (avatarInputRef.current) avatarInputRef.current.value = ""; }}
                    className="mt-2 font-mono-s2m text-[10px] tracker-wide transition-opacity hover:opacity-70"
                    style={{ color: "var(--muted-2)" }}
                  >
                    REMOVE →
                  </button>
                )}
              </Field>
              <Field span={6} label="Overall skill level" hint="BE HONEST">
                <select
                  className="athletic w-full border focus:outline-none px-5 py-4 text-base transition-colors"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                >
                  {SKILL_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field span={6} label="Location" hint="CITY OR ZIP">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--volt)" }}>
                      <IconPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Brooklyn, NY"
                      className="w-full border focus:outline-none pl-11 pr-5 py-4 text-base placeholder:text-neutral-600 transition-colors"
                      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--volt)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={detectingLocation}
                    title="Detect my location"
                    className="relative shrink-0 border px-4 py-4 font-mono-s2m text-[11px] tracker-wide transition-all disabled:opacity-50 overflow-hidden"
                    style={{
                      borderColor: "var(--border-strong)",
                      background: "var(--surface)",
                      color: detectingLocation ? "var(--volt)" : "var(--muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {detectingLocation && (
                      <span className="absolute inset-0 shimmer pointer-events-none" />
                    )}
                    <span className="flex items-center gap-2">
                      <IconPin className="w-3.5 h-3.5" style={{ color: "var(--volt)" }} />
                      {detectingLocation ? "DETECTING…" : "DETECT"}
                    </span>
                  </button>
                </div>
              </Field>
            </div>
          </FormSection>

          {/* Section II — Bio */}
          <FormSection
            number="II"
            title="Tell your story"
            subtitle="A few sentences about how you move. Our AI will read it and pre-fill your sports."
          >
            <div className="grid grid-cols-12 gap-5">
              <div style={{ gridColumn: "span 12 / span 12" }}>
                <label className="flex items-baseline justify-between mb-2">
                  <span className="font-mono-s2m text-[11px] uppercase tracker-wide text-neutral-300">Short bio</span>
                  <span className="font-mono-s2m text-[10px] tracker-wide text-neutral-600">OPTIONAL</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  placeholder="ex: Played varsity basketball in college, now I run trails on weekends and pick up tennis when the weather's good…"
                  className="w-full border focus:outline-none px-5 py-4 text-base placeholder:text-neutral-600 transition-colors resize-none"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--volt)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleDetectSports}
                disabled={detecting || !bio.trim()}
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 border-2 font-bold tracker-wide text-sm transition-all"
                style={{
                  borderColor: "var(--volt)",
                  color: "var(--volt)",
                  opacity: !bio.trim() ? 0.4 : 1,
                  cursor: detecting ? "wait" : !bio.trim() ? "not-allowed" : "pointer",
                }}
              >
                {detecting && (
                  <span className="absolute inset-0 shimmer pointer-events-none" />
                )}
                <IconSparkle className={`w-4 h-4 ${detecting ? "animate-pulse" : ""}`} />
                {detecting ? "READING YOUR BIO…" : "DETECT MY SPORTS"}
                {!detecting && <span className="opacity-60">✨</span>}
              </button>
              <span className="text-xs text-neutral-500 font-mono-s2m uppercase">
                {detecting ? "parsing tokens…" : "powered by claude · runs on your bio"}
              </span>
            </div>
          </FormSection>

          {/* Section III — Sports */}
          <FormSection
            number="III"
            title="Your sports"
            subtitle="Pick what you play. Click a card to toggle. Set your level for each."
            counter={`${Object.keys(selectedSports).length}/${SPORTS.length} SELECTED`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {SPORTS.map((sport) => (
                <SportCard
                  key={sport}
                  sport={sport}
                  selected={sport in selectedSports}
                  skillValue={selectedSports[sport]}
                  onToggle={() => toggleSport(sport, !(sport in selectedSports))}
                  onSkillChange={(skill) => setSportSkill(sport, skill)}
                />
              ))}
            </div>
          </FormSection>

          {/* Error */}
          {error && (
            <p className="mt-6 font-mono-s2m text-sm" style={{ color: "var(--orange)" }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <div className="mt-20">
            <button
              type="submit"
              disabled={submitting}
              className="w-full group relative overflow-hidden border-2 transition-all"
              style={
                canSubmit && !submitting
                  ? { background: "var(--volt)", borderColor: "var(--volt)", color: "black" }
                  : { background: "transparent", borderColor: "#262626", color: "#404040", cursor: submitting ? "wait" : "not-allowed" }
              }
            >
              <div className="flex items-center justify-between px-10 py-8">
                <div className="flex items-center gap-6">
                  <span className="font-mono-s2m text-xs tracker-wide opacity-70">04 / 04</span>
                  <span className="font-display uppercase tracker-tight leading-none" style={{ fontSize: "clamp(48px, 8vw, 96px)" }}>
                    {submitting ? "Submitting…" : "Let's Go"}
                  </span>
                </div>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-2"
                  style={
                    canSubmit && !submitting
                      ? { background: "black", color: "var(--volt)" }
                      : { background: "#111", color: "#404040" }
                  }
                >
                  <IconArrow className="w-7 h-7" />
                </div>
              </div>
              {canSubmit && !submitting && <div className="absolute inset-x-0 bottom-0 h-2 stripes-volt" />}
            </button>
            <div className="mt-4 flex justify-between items-center text-[11px] font-mono-s2m uppercase text-neutral-600 tracker-wide">
              <span>By continuing you agree to play fair, show up on time, no flake.</span>
              <span>v 2.6 · BUILD 0509</span>
            </div>
            <div className="mt-5 pt-5 border-t text-[11px] font-mono-s2m tracker-wide text-center" style={{ borderColor: "var(--border)" }}>
              <span style={{ color: "var(--muted-2)" }}>ALREADY HAVE AN ACCOUNT?{" "}</span>
              <Link
                href="/login"
                className="font-bold transition-opacity hover:opacity-70"
                style={{ color: "var(--volt)" }}
              >
                LOG IN →
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
