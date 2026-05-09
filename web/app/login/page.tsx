"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function IconBolt(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
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

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 flex items-center justify-center" style={{ background: "var(--volt)", color: "black" }}>
        <IconBolt className="w-5 h-5" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display uppercase text-2xl tracker-tight leading-none">ShowUp</span>
        <span className="font-display uppercase text-2xl tracker-tight leading-none" style={{ color: "var(--volt)" }}>2Move</span>
      </div>
    </div>
  );
}

function TopMarquee() {
  const items = ["SHOW UP", "MOVE FAST", "PLAY HARD", "NO EXCUSES", "EVERY DAY", "STAY READY", "TRAIN MODE", "GAME ON"];
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-b" style={{ borderColor: "var(--border)" }}>
      <div className="flex whitespace-nowrap py-2 marquee-track text-[11px] font-bold tracker-wide pill-row" style={{ color: "var(--muted-2)" }}>
        {repeated.map((t, i) => (
          <span key={i} className="flex items-center gap-3 shrink-0">
            <span className="w-1 h-1 rounded-full" style={{ background: "var(--volt)" }}></span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/users?email=${encodeURIComponent(email.trim())}`);
      if (res.status === 404) {
        setError("No account found with that email.");
        return;
      }
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }
      const user = await res.json();
      localStorage.setItem("userId", user.id);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <TopMarquee />

      {/* Header */}
      <header
        className="border-b"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-[1400px] mx-auto px-10 py-5">
          <Logo />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          {/* Label */}
          <div className="flex items-center gap-3 mb-6 text-xs font-bold tracker-wide" style={{ color: "var(--volt)" }}>
            <span className="w-8 h-px" style={{ background: "var(--volt)" }}></span>
            RETURNING ATHLETE
          </div>

          {/* Heading */}
          <h1 className="font-display uppercase text-6xl tracker-tight leading-[0.88] mb-10">
            Welcome<br />
            <span style={{ color: "var(--volt)" }}>Back.</span>
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-mono-s2m text-[11px] tracker-wide uppercase"
                style={{ color: "var(--muted)" }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full px-4 py-3.5 text-sm border bg-transparent focus:outline-none transition-colors disabled:opacity-50"
                style={{
                  borderColor: error ? "var(--orange)" : "var(--border-strong)",
                  color: "var(--fg)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--volt)")}
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = error ? "var(--orange)" : "var(--border-strong)")
                }
              />
              {error && (
                <p className="font-mono-s2m text-[11px] tracker-wide" style={{ color: "var(--orange)" }}>
                  ✕ {error}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="relative w-full border-2 overflow-hidden group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={
                email.trim() && !loading
                  ? { borderColor: "var(--volt)", background: "var(--volt)", color: "black" }
                  : { borderColor: "var(--border-strong)", background: "transparent", color: "var(--fg)" }
              }
            >
              <div className="flex items-center justify-between px-6 py-4">
                <span className="font-display uppercase text-2xl tracker-tight leading-none">
                  {loading ? "Checking…" : "Log In"}
                </span>
                <IconArrow className="w-6 h-6" />
              </div>
              {loading && <div className="absolute bottom-0 left-0 right-0 h-1 stripes-volt"></div>}
            </button>
          </form>

          {/* Footer link */}
          <div
            className="mt-10 pt-8 border-t font-mono-s2m text-[11px] tracker-wide"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            No account?{" "}
            <Link
              href="/"
              className="font-bold transition-opacity hover:opacity-70"
              style={{ color: "var(--volt)" }}
            >
              Join here →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="px-10 py-6 border-t flex flex-wrap justify-between items-center text-[10px] font-mono-s2m tracker-wide"
        style={{ borderColor: "var(--border)", color: "var(--muted-2)" }}
      >
        <div>© 2026 SHOWUP2MOVE · ALL ATHLETES WELCOME</div>
        <div className="flex gap-6">
          <span>SYSTEM OK</span>
          <span>v 2.6.1</span>
        </div>
      </footer>
    </div>
  );
}
