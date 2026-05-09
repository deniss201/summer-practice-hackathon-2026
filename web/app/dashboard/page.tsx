"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  avatar?: string | null;
  location: string | null;
  sportPreferences: SportPreference[];
  todayAvailability: TodayAvailability | null;
}

interface GroupMember {
  id: string;
  userId: string;
  role: string;
  confirmed: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  user: { name: string };
  userId?: string;
  createdAt?: string;
}

interface OpenGroup {
  id: string;
  sport: string;
  description?: string | null;
  memberCount: number;
  captainName: string;
}

interface Venue {
  name: string;
  address: string;
  estimatedPrice: string;
  notes: string;
}

interface GroupEvent {
  id: string;
  venue: string;
  time: string;
}

interface MatchGroup {
  id: string;
  sport: string;
  timeSlot: string;
  status: string;
  members: GroupMember[];
  event?: GroupEvent | null;
}

// ── Icons ──────────────────────────────────────────────────────
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
function IconSearch(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="square" />
    </svg>
  );
}
function IconCrown(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M3 7l4 4 5-7 5 7 4-4v11H3V7zm0 13h18v2H3z" />
    </svg>
  );
}
function IconClock(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="square" />
    </svg>
  );
}

// ── Logo ───────────────────────────────────────────────────────
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

// ── TopMarquee ─────────────────────────────────────────────────
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

// ── StatCard ───────────────────────────────────────────────────
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border px-3 py-3" style={{ borderColor: "var(--border)" }}>
      <div className="font-mono-s2m text-[9px] tracker-wide" style={{ color: "var(--muted)" }}>{label}</div>
      <div className="font-display uppercase text-3xl tracker-tight leading-none mt-1">{value}</div>
    </div>
  );
}

// ── Mini ───────────────────────────────────────────────────────
function Mini({ label, value, inverted }: { label: string; value: string; inverted: boolean }) {
  return (
    <div className="border p-3" style={{ borderColor: inverted ? "rgba(0,0,0,0.3)" : "var(--border)" }}>
      <div className="text-[9px] font-mono-s2m tracker-wide" style={{ color: inverted ? "rgba(0,0,0,0.6)" : "var(--muted)" }}>{label}</div>
      <div className="font-display uppercase text-2xl tracker-tight leading-none mt-1">{value}</div>
    </div>
  );
}

// ── ShowUpToggle ───────────────────────────────────────────────
function ShowUpToggle({ on, onToggle, loading }: { on: boolean; onToggle: () => void; loading: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      className={`relative w-full overflow-hidden border-2 transition-all duration-500 text-left disabled:opacity-70 ${
        on
          ? "pulse-volt"
          : ""
      }`}
      style={
        on
          ? { background: "var(--volt)", borderColor: "var(--volt)", color: "black" }
          : { background: "var(--surface)", borderColor: "var(--border-strong)", color: "white" }
      }
    >
      {/* Status row */}
      <div className="flex items-center justify-between px-10 pt-8">
        <div className="flex items-center gap-3 text-xs font-bold tracker-wide">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: on ? "black" : "var(--muted-2)" }}
          ></span>
          {on ? "STATUS — LIVE & READY" : "STATUS — OFF THE GRID"}
        </div>
        <div className="text-xs font-mono-s2m tracker-wide" style={{ color: on ? "rgba(0,0,0,0.6)" : "var(--muted-2)" }}>
          {loading ? "UPDATING…" : `TAP TO ${on ? "STAND DOWN" : "IGNITE"}`}
        </div>
      </div>

      {/* Headline */}
      <div className="px-10 pt-6 pb-10">
        <div className="font-display uppercase leading-[0.82] tracker-tight" style={{ fontSize: "clamp(80px,13vw,220px)" }}>
          {on ? (
            <>
              I&apos;M<br />
              <span className="inline-flex items-center gap-6">
                IN<span>.</span>
                <span
                  className="inline-flex w-20 h-20 items-center justify-center"
                  style={{ background: "black", color: "var(--volt)" }}
                >
                  <IconBolt className="w-12 h-12" />
                </span>
              </span>
            </>
          ) : (
            <>
              Show Up<br />
              <span style={{ color: "var(--volt)" }}>Today</span>
            </>
          )}
        </div>

        {/* Description row */}
        <div
          className="mt-8 grid grid-cols-12 gap-6 items-end"
          style={{ color: on ? "black" : "var(--muted)" }}
        >
          <div className="col-span-12 md:col-span-7 text-base leading-relaxed">
            {on
              ? "You are visible to nearby athletes. Match alerts active. Captain calls you within 2 hours on average. Stay near your phone."
              : "Flip this on and you're live. Anyone running your sports nearby can pull you into a game. Off-grid by default."}
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="grid grid-cols-3 gap-2" style={{ color: on ? "black" : "white" }}>
              <Mini label="WITHIN" value="3 MI" inverted={on} />
              <Mini label="WINDOW" value="6 HRS" inverted={on} />
              <Mini label="LEVEL" value="MATCH" inverted={on} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom toggle indicator */}
      <div className="flex items-stretch border-t-2" style={{ borderColor: on ? "black" : "var(--border-strong)" }}>
        <div
          className="flex-1 px-10 py-5 flex items-center justify-between"
          style={on ? { background: "black", color: "var(--volt)" } : {}}
        >
          <span className="font-mono-s2m text-xs tracker-wide">01 LIVE / 02 OFF</span>
          <div
            className="relative w-20 h-9 border-2 rounded-full transition-colors"
            style={{
              borderColor: on ? "var(--volt)" : "var(--muted-2)",
              background: on ? "transparent" : "var(--surface-2)",
            }}
          >
            <div
              className="absolute top-0.5 w-7 h-7 rounded-full transition-all"
              style={{
                left: on ? "44px" : "2px",
                background: on ? "var(--volt)" : "var(--muted-2)",
              }}
            ></div>
          </div>
        </div>
      </div>

      {on && (
        <div className="absolute right-10 top-10 hidden md:flex flex-col gap-1.5 items-end">
          <div className="w-16 h-1 bg-black"></div>
          <div className="w-10 h-1 bg-black"></div>
          <div className="w-20 h-1 bg-black"></div>
        </div>
      )}
    </button>
  );
}

// ── CaptainBadge ───────────────────────────────────────────────
function CaptainBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 font-bold text-[10px] tracker-wide px-2 py-1"
      style={{ background: "var(--orange)", color: "black" }}
    >
      <IconCrown className="w-3 h-3" />
      CAPTAIN
    </span>
  );
}

// ── VenueCard ──────────────────────────────────────────────────
function VenueCard({
  venue,
  index,
  onSelect,
  selecting,
}: {
  venue: Venue;
  index: number;
  onSelect?: () => void;
  selecting?: boolean;
}) {
  return (
    <div className="border flex flex-col" style={{ borderColor: "var(--border-strong)", background: "var(--surface-2)" }}>
      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono-s2m text-[10px] tracker-wide" style={{ color: "var(--volt)" }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-bold text-sm">{venue.name}</span>
            </div>
            <div className="font-mono-s2m text-[11px] tracker-wide" style={{ color: "var(--muted)" }}>
              {venue.address}
            </div>
          </div>
          <div
            className="shrink-0 font-mono-s2m text-[11px] tracker-wide px-2 py-1 border whitespace-nowrap"
            style={{ color: "var(--volt)", borderColor: "rgba(204,245,40,0.3)" }}
          >
            {venue.estimatedPrice}
          </div>
        </div>
        <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          → {venue.notes}
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + " " + venue.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono-s2m text-[10px] tracker-wide transition-opacity hover:opacity-70 mt-1"
          style={{ color: "var(--muted-2)" }}
        >
          ↗ VIEW ON MAP
        </a>
      </div>
      {onSelect && (
        <button
          onClick={onSelect}
          disabled={selecting}
          className="border-t px-5 py-3 font-mono-s2m text-[11px] tracker-wide text-left transition-opacity hover:opacity-70 disabled:opacity-50"
          style={{ borderColor: "var(--border-strong)", color: "var(--volt)" }}
        >
          {selecting ? "SELECTING…" : "SELECT THIS VENUE →"}
        </button>
      )}
    </div>
  );
}

// ── GroupCard ──────────────────────────────────────────────────
function GroupCard({
  group,
  index,
  nameMap,
  currentUserId,
  userLocation,
  venues,
  venueLoading,
  onFindVenues,
  locked,
  locking,
  onLockIn,
  detailsOpen,
  onToggleDetails,
  selectingVenue,
  onSelectVenue,
  messages,
  chatInput,
  onChatInput,
  onSendMessage,
  onLeave,
}: {
  group: MatchGroup;
  index: number;
  nameMap: Record<string, string>;
  currentUserId: string;
  userLocation: string | null;
  venues: Venue[] | null;
  venueLoading: boolean;
  onFindVenues: () => void;
  locked: boolean;
  locking: boolean;
  onLockIn: () => void;
  detailsOpen: boolean;
  onToggleDetails: () => void;
  selectingVenue: boolean;
  onSelectVenue: (venueName: string) => void;
  messages: ChatMessage[];
  chatInput: string;
  onChatInput: (v: string) => void;
  onSendMessage: () => void;
  onLeave: () => void;
}) {
  const totalSlots = 10;
  const emptySlots = Math.max(0, Math.min(3, totalSlots - group.members.length));
  const isCaptain = group.members.some(
    (m) => m.userId === currentUserId && m.role === "captain"
  );
  const confirmedCount = group.members.filter((m) => m.confirmed).length;

  function handleDetails() {
    if (isCaptain) {
      onFindVenues();
    } else {
      onToggleDetails();
    }
  }

  return (
    <article
      className="relative border overflow-hidden group transition-colors"
      style={{ background: "var(--surface)", borderColor: "var(--border-strong)" }}
    >
      {/* Index marker */}
      <div
        className="absolute top-0 left-0 font-mono-s2m text-[10px] tracker-wide px-3 py-1.5"
        style={{ background: "var(--volt)", color: "black" }}
      >
        MATCH /{String(index + 1).padStart(2, "0")}
      </div>

      <div className="px-7 pt-14 pb-6">
        <h3 className="font-display uppercase text-7xl tracker-tight leading-[0.85] capitalize">
          {group.sport}
        </h3>
        <div className="mt-4 flex items-center gap-3 text-xs font-mono-s2m tracker-wide" style={{ color: "var(--muted)" }}>
          <IconClock className="w-4 h-4" />
          <span>TODAY · MATCH READY</span>
        </div>
      </div>

      {/* Members list */}
      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="px-7 py-3 flex items-center justify-between">
          <span className="font-mono-s2m text-[10px] tracker-wide" style={{ color: "var(--muted)" }}>
            ROSTER · {group.members.length}/{totalSlots}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono-s2m text-[10px] tracker-wide" style={{ color: confirmedCount > 0 ? "var(--volt)" : "var(--muted-2)" }}>
              {confirmedCount}/{group.members.length} LOCKED
            </span>
            <span className="font-mono-s2m text-[10px] tracker-wide" style={{ color: "var(--muted)" }}>
              ROLE
            </span>
          </div>
        </div>
        <ul className="border-t" style={{ borderColor: "var(--border)" }}>
          {group.members.map((m, i) => {
            const name = nameMap[m.userId] ?? m.userId;
            const initials = name.split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();
            const isYou = m.userId === currentUserId;
            return (
              <li
                key={m.id}
                className="flex items-center px-7 py-3 border-b"
                style={{
                  borderColor: "var(--border)",
                  background: isYou ? "rgba(204,245,40,0.04)" : undefined,
                }}
              >
                <div className="w-7 font-mono-s2m text-[11px]" style={{ color: "var(--muted-2)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className="w-9 h-9 flex items-center justify-center font-display text-base mr-4 border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border-strong)" }}
                >
                  {initials}
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <span className="font-bold" style={{ color: isYou ? "var(--volt)" : "var(--fg)" }}>
                    {name}
                  </span>
                  {m.role === "captain" && <CaptainBadge />}
                  {isYou && (
                    <span
                      className="text-[10px] font-mono-s2m tracker-wide px-1.5 py-0.5 border"
                      style={{ color: "var(--volt)", borderColor: "rgba(204,245,40,0.4)" }}
                    >
                      YOU
                    </span>
                  )}
                </div>
                <div className="font-mono-s2m text-[11px] tracker-wide" style={{ color: "var(--muted)" }}>
                  {m.role.toUpperCase()}
                </div>
              </li>
            );
          })}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <li
              key={"e" + i}
              className="flex items-center px-7 py-3 border-b stripes opacity-40"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="w-7 font-mono-s2m text-[11px]" style={{ color: "var(--muted-2)" }}>
                {String(group.members.length + i + 1).padStart(2, "0")}
              </div>
              <div className="w-9 h-9 border border-dashed mr-4" style={{ borderColor: "var(--border-strong)" }}></div>
              <div className="flex-1 font-mono-s2m text-[11px] tracker-wide" style={{ color: "var(--muted-2)" }}>
                OPEN SLOT
              </div>
              <div className="font-mono-s2m text-[11px] tracker-wide" style={{ color: "var(--muted-2)" }}>—</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmed venue banner — visible to all members */}
      {group.event && (
        <div
          className="border-t px-7 py-5 flex flex-col gap-2"
          style={{ borderColor: "var(--border)", background: "rgba(204,245,40,0.06)" }}
        >
          <div className="font-mono-s2m text-[10px] tracker-wide" style={{ color: "var(--volt)" }}>
            ✓ VENUE CONFIRMED
          </div>
          <div className="font-bold text-base">{group.event.venue}</div>
          <div className="font-mono-s2m text-[11px] tracker-wide" style={{ color: "var(--muted)" }}>
            {new Date(group.event.time).toLocaleString("en-US", {
              weekday: "short", month: "short", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex border-t" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={onLockIn}
          disabled={locked || locking}
          className="flex-1 font-display uppercase text-2xl tracker-tight py-4 flex items-center justify-center gap-3 transition-colors disabled:cursor-default"
          style={
            locked
              ? { background: "var(--surface-2)", color: "var(--volt)" }
              : { background: "var(--volt)", color: "black" }
          }
        >
          {locking ? "LOCKING…" : locked ? "LOCKED IN ✓" : <>Lock In <IconArrow className="w-5 h-5" /></>}
        </button>
        <button
          onClick={handleDetails}
          className="px-6 border-l font-mono-s2m text-xs tracker-wide transition-opacity hover:opacity-70"
          style={{
            borderColor: locked ? "var(--border)" : "rgba(0,0,0,0.2)",
            background: locked ? "var(--surface-2)" : "var(--volt)",
            color: locked ? "var(--muted)" : "rgba(0,0,0,0.6)",
          }}
        >
          {isCaptain ? "VENUES" : "DETAILS"}
        </button>
        <button
          onClick={onLeave}
          className="px-4 border-l font-mono-s2m text-[10px] tracker-wide transition-opacity hover:opacity-70"
          style={{ borderColor: "var(--border)", background: "var(--surface-2)", color: "var(--muted-2)" }}
          title="Leave group"
        >
          ✕
        </button>
      </div>

      {/* Non-captain details panel */}
      {!isCaptain && detailsOpen && (
        <div className="border-t px-7 py-5 flex flex-col gap-4" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
          <div className="font-mono-s2m text-[10px] tracker-wide" style={{ color: "var(--volt)" }}>
            GROUP DETAILS
          </div>

          {/* Sport + member count */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border p-3" style={{ borderColor: "var(--border-strong)" }}>
              <div className="font-mono-s2m text-[9px] tracker-wide mb-1" style={{ color: "var(--muted)" }}>SPORT</div>
              <div className="font-display uppercase text-xl tracker-tight capitalize">{group.sport}</div>
            </div>
            <div className="border p-3" style={{ borderColor: "var(--border-strong)" }}>
              <div className="font-mono-s2m text-[9px] tracker-wide mb-1" style={{ color: "var(--muted)" }}>MEMBERS</div>
              <div className="font-display uppercase text-xl tracker-tight">{group.members.length}</div>
            </div>
          </div>

          {/* Member list with captain highlighted */}
          <div className="border" style={{ borderColor: "var(--border-strong)" }}>
            <div className="px-4 py-2 border-b font-mono-s2m text-[9px] tracker-wide" style={{ borderColor: "var(--border-strong)", color: "var(--muted)" }}>
              ROSTER
            </div>
            <ul>
              {group.members.map((m) => {
                const name = nameMap[m.userId] ?? m.userId;
                const isYou = m.userId === currentUserId;
                const isCap = m.role === "captain";
                return (
                  <li key={m.id} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0" style={{ borderColor: "var(--border-strong)" }}>
                    <span className="flex-1 text-sm font-bold" style={{ color: isYou ? "var(--volt)" : "var(--fg)" }}>
                      {name}
                    </span>
                    {isCap && <CaptainBadge />}
                    {isYou && (
                      <span className="font-mono-s2m text-[10px] tracker-wide px-1.5 py-0.5 border" style={{ color: "var(--volt)", borderColor: "rgba(204,245,40,0.4)" }}>
                        YOU
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Venue status */}
          {group.event ? (
            <div className="border px-4 py-4 flex flex-col gap-1" style={{ borderColor: "rgba(204,245,40,0.3)", background: "rgba(204,245,40,0.06)" }}>
              <div className="font-mono-s2m text-[10px] tracker-wide mb-1" style={{ color: "var(--volt)" }}>
                ✓ VENUE CONFIRMED
              </div>
              <div className="font-bold text-base">{group.event.venue}</div>
              <div className="font-mono-s2m text-[11px] tracker-wide" style={{ color: "var(--muted)" }}>
                {new Date(group.event.time).toLocaleString("en-US", {
                  weekday: "short", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </div>
            </div>
          ) : (
            <div className="border px-4 py-3 text-sm" style={{ borderColor: "var(--border-strong)", color: "var(--muted)" }}>
              <span style={{ color: "var(--volt)" }}>◌</span>{" "}
              Waiting for captain to set the venue…
            </div>
          )}
        </div>
      )}

      {/* Captain venue suggestions — triggered by VENUES button */}
      {isCaptain && (venues !== null || venueLoading) && (
        <div className="border-t" style={{ borderColor: "var(--border)" }}>
          {venueLoading && (
            <div className="px-7 py-5" style={{ background: "var(--surface-2)" }}>
              <div className="font-mono-s2m text-[10px] tracker-wide mb-3" style={{ color: "var(--volt)" }}>
                SCANNING VENUES…
              </div>
              <div className="h-1 stripes-volt"></div>
              <div className="shimmer h-4 mt-3 w-3/4"></div>
              <div className="shimmer h-4 mt-2 w-1/2"></div>
            </div>
          )}

          {venues !== null && venues.length > 0 && (
            <div className="px-7 py-5 flex flex-col gap-3" style={{ background: "var(--surface-2)" }}>
              <div className="flex items-center justify-between mb-1">
                <div className="font-mono-s2m text-[10px] tracker-wide" style={{ color: "var(--volt)" }}>
                  VENUE PICKS · {group.sport.toUpperCase()}
                </div>
                <button
                  onClick={onFindVenues}
                  className="font-mono-s2m text-[10px] tracker-wide transition-opacity hover:opacity-70"
                  style={{ color: "var(--muted)" }}
                >
                  REFRESH ↺
                </button>
              </div>
              {venues.map((v, i) => (
                <VenueCard
                  key={i}
                  venue={v}
                  index={i}
                  onSelect={group.event ? undefined : () => onSelectVenue(v.name)}
                  selecting={selectingVenue}
                />
              ))}
            </div>
          )}

          {venues !== null && venues.length === 0 && !venueLoading && (
            <div className="px-7 py-5 text-sm" style={{ background: "var(--surface-2)", color: "var(--muted)" }}>
              No venue suggestions returned.{" "}
              <button onClick={onFindVenues} className="underline hover:opacity-70">Try again</button>
            </div>
          )}
        </div>
      )}

      {/* Group chat */}
      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="px-7 py-3 flex items-center gap-2">
          <span className="font-mono-s2m text-[10px] tracker-wide" style={{ color: "var(--muted)" }}>
            CREW CHAT
          </span>
          <span className="font-mono-s2m text-[10px]" style={{ color: "var(--muted-2)" }}>
            · {messages.length}
          </span>
        </div>
        <div
          className="border-t max-h-52 overflow-y-auto flex flex-col gap-0"
          style={{ borderColor: "var(--border)" }}
        >
          {messages.length === 0 ? (
            <div className="px-7 py-4 font-mono-s2m text-[11px] tracker-wide" style={{ color: "var(--muted-2)" }}>
              No messages yet. Say something.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="px-7 py-2.5 border-b text-sm"
                style={{
                  borderColor: "var(--border)",
                  background: msg.userId === currentUserId ? "rgba(204,245,40,0.03)" : undefined,
                  color: "var(--fg)",
                }}
              >
                <div className="flex items-baseline gap-2">
                  <strong style={{ color: msg.userId === currentUserId ? "var(--volt)" : "var(--fg)" }}>
                    {msg.user?.name}:
                  </strong>
                  <span className="leading-relaxed">{msg.text}</span>
                  {msg.createdAt && (
                    <span className="ml-auto shrink-0 font-mono-s2m text-[10px]" style={{ color: "var(--muted-2)" }}>
                      {new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex border-t" style={{ borderColor: "var(--border)" }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => onChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSendMessage(); } }}
            placeholder="Type a message…"
            className="flex-1 px-5 py-3 text-sm focus:outline-none placeholder:text-neutral-600"
            style={{ background: "var(--surface-2)", color: "var(--fg)" }}
          />
          <button
            onClick={onSendMessage}
            disabled={!chatInput.trim()}
            className="px-5 py-3 font-mono-s2m text-[11px] tracker-wide border-l transition-opacity hover:opacity-70 disabled:opacity-40"
            style={{ borderColor: "var(--border)", color: "var(--volt)", background: "var(--surface-2)" }}
          >
            SEND →
          </button>
        </div>
      </div>
    </article>
  );
}

// ── EmptyState ─────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      className="border-2 border-dashed relative overflow-hidden px-10 py-20"
      style={{ borderColor: "var(--border-strong)", background: "rgba(20,20,20,0.5)" }}
    >
      <div className="absolute inset-0 stripes opacity-50 pointer-events-none"></div>
      <div className="relative grid grid-cols-12 gap-8 items-center">
        <div className="col-span-12 lg:col-span-3">
          <div
            className="w-32 h-32 border-2 rotate-12 flex items-center justify-center mx-auto lg:mx-0"
            style={{ borderColor: "var(--volt)", color: "var(--volt)" }}
          >
            <IconBolt className="w-16 h-16 -rotate-12" />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 text-center lg:text-left">
          <div className="text-xs font-bold tracker-wide mb-3" style={{ color: "var(--volt)" }}>
            EMPTY ROSTER
          </div>
          <h3 className="font-display uppercase text-5xl tracker-tight leading-[0.9]">
            No groups<br />YET, ROOKIE
          </h3>
          <p className="mt-4 max-w-md" style={{ color: "var(--muted)" }}>
            Hit &quot;Find My Group&quot; above to scan nearby athletes and pull together your first crew.
            We&apos;ll surface 2-3 matches that fit your sports and skill level.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-3">
          <ul className="space-y-3 font-mono-s2m text-[11px] tracker-wide" style={{ color: "var(--muted)" }}>
            <li className="flex items-center gap-3">
              <span style={{ color: "var(--volt)" }}>→</span> 2,341 ATHLETES NEARBY
            </li>
            <li className="flex items-center gap-3">
              <span style={{ color: "var(--volt)" }}>→</span> 47 GAMES THIS WEEK
            </li>
            <li className="flex items-center gap-3">
              <span style={{ color: "var(--volt)" }}>→</span> AVG. MATCH IN 4 MIN
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [toggling, setToggling] = useState(false);

  const [groups, setGroups] = useState<MatchGroup[] | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [nameMap, setNameMap] = useState<Record<string, string>>({});
  // groupId → venue state
  const [venueMap, setVenueMap] = useState<Record<string, Venue[] | null>>({});
  const [venueLoadingMap, setVenueLoadingMap] = useState<Record<string, boolean>>({});
  const [lockedMap, setLockedMap] = useState<Record<string, boolean>>({});
  const [lockingMap, setLockingMap] = useState<Record<string, boolean>>({});
  const [detailsOpenMap, setDetailsOpenMap] = useState<Record<string, boolean>>({});
  const [selectingVenueMap, setSelectingVenueMap] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  // Create Event
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [createSport, setCreateSport] = useState("football");
  const [createDescription, setCreateDescription] = useState("");
  const [creating, setCreating] = useState(false);
  // Browse Groups
  const [openGroups, setOpenGroups] = useState<OpenGroup[] | null>(null);
  const [loadingOpenGroups, setLoadingOpenGroups] = useState(false);
  const [joiningMap, setJoiningMap] = useState<Record<string, boolean>>({});
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [userId, setUserId] = useState<string | null>(null);

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
    setUserId(id);
    setCurrentGroupId(localStorage.getItem("currentGroupId"));
    setLoadingUser(true);
    setGroups(null);
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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;
    const savedGroupId = localStorage.getItem("currentGroupId");
    if (!savedGroupId) return;

    fetch(`/api/groups/${savedGroupId}`)
      .then(async (res) => {
        if (!res.ok) { localStorage.removeItem("currentGroupId"); setCurrentGroupId(null); return; }
        const group: MatchGroup = await res.json();
        if (!group.members.some((m) => m.userId === user.id)) {
          localStorage.removeItem("currentGroupId");
          setCurrentGroupId(null);
          return;
        }
        setGroups([group]);
        setCurrentGroupId(savedGroupId);
        await resolveNames(group.members.map((m) => m.userId));
      })
      .catch(() => { localStorage.removeItem("currentGroupId"); setCurrentGroupId(null); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!currentGroupId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/groups/${currentGroupId}/chat`);
        const data = await res.json();
        console.log("[chat poll]", data);
        if (Array.isArray(data)) setMessages(data);
      } catch (e) {
        console.error("chat fetch error", e);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [currentGroupId]);

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
    try {
      const savedId = localStorage.getItem("currentGroupId");
      if (savedId) {
        const res = await fetch(`/api/groups/${savedId}`);
        if (res.ok) {
          const group: MatchGroup = await res.json();
          if (group.members.some((m) => m.userId === user?.id)) {
            setGroups([group]);
            setCurrentGroupId(savedId);
            await resolveNames(group.members.map((m) => m.userId));
            return;
          }
        }
        localStorage.removeItem("currentGroupId");
        setCurrentGroupId(null);
      }
      setGroups(null);
      const res = await fetch("/api/match/run", { method: "POST" });
      const data = await res.json();
      const matched: MatchGroup[] = (data.groups ?? []).filter((g: MatchGroup) =>
        g.members.some((m) => m.userId === user?.id)
      );
      setGroups(matched);
      if (matched.length > 0) {
        localStorage.setItem("currentGroupId", matched[0].id);
        setCurrentGroupId(matched[0].id);
      } else {
        localStorage.removeItem("currentGroupId");
        setCurrentGroupId(null);
      }
      await resolveNames(matched.flatMap((g) => g.members.map((m) => m.userId)));
    } finally {
      setMatchLoading(false);
    }
  }

  async function handleFindVenues(groupId: string, sport: string) {
    if (!user?.location) return;
    setVenueLoadingMap((prev) => ({ ...prev, [groupId]: true }));
    try {
      const res = await fetch("/api/ai/venue-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sport, location: user.location }),
      });
      const data = await res.json();
      setVenueMap((prev) => ({ ...prev, [groupId]: data.venues ?? [] }));
    } finally {
      setVenueLoadingMap((prev) => ({ ...prev, [groupId]: false }));
    }
  }

  async function handleLockIn(groupId: string) {
    if (!userId) return;
    setLockingMap((prev) => ({ ...prev, [groupId]: true }));
    try {
      const res = await fetch("/api/groups/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, userId }),
      });
      if (!res.ok) return;
      setLockedMap((prev) => ({ ...prev, [groupId]: true }));
      setGroups((prev) =>
        prev?.map((g) =>
          g.id === groupId
            ? {
                ...g,
                members: g.members.map((m) =>
                  m.userId === userId ? { ...m, confirmed: true } : m
                ),
              }
            : g
        ) ?? prev
      );
    } finally {
      setLockingMap((prev) => ({ ...prev, [groupId]: false }));
    }
  }

  async function handleSelectVenue(groupId: string, venueName: string) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    setSelectingVenueMap((prev) => ({ ...prev, [groupId]: true }));
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, venue: venueName, time: tomorrow.toISOString() }),
      });
      if (!res.ok) return;
      const event: GroupEvent = await res.json();
      setGroups((prev) =>
        prev?.map((g) =>
          g.id === groupId ? { ...g, status: "confirmed", event } : g
        ) ?? prev
      );
    } finally {
      setSelectingVenueMap((prev) => ({ ...prev, [groupId]: false }));
    }
  }

  async function sendMessage() {
    if (!chatInput.trim() || !currentGroupId) return;
    const text = chatInput;
    setChatInput("");
    await fetch(`/api/groups/${currentGroupId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: localStorage.getItem("userId"), text }),
    });
    const res = await fetch(`/api/groups/${currentGroupId}/chat`);
    const data = await res.json();
    if (Array.isArray(data)) setMessages(data);
  }

  async function handleCreateEvent() {
    if (!userId) return;
    setCreating(true);
    try {
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sport: createSport, description: createDescription }),
      });
      if (!res.ok) return;
      const group: MatchGroup = await res.json();
      localStorage.setItem("currentGroupId", group.id);
      setCurrentGroupId(group.id);
      setGroups([group]);
      setShowCreateEvent(false);
      setCreateDescription("");
    } finally {
      setCreating(false);
    }
  }

  async function handleLoadOpenGroups() {
    setLoadingOpenGroups(true);
    try {
      const res = await fetch("/api/groups/open");
      const data = await res.json();
      setOpenGroups(Array.isArray(data) ? data : []);
    } finally {
      setLoadingOpenGroups(false);
    }
  }

  async function handleJoinGroup(groupId: string) {
    if (!userId) return;
    setJoiningMap((prev) => ({ ...prev, [groupId]: true }));
    try {
      const res = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) return;
      const group: MatchGroup = await res.json();
      localStorage.setItem("currentGroupId", group.id);
      setCurrentGroupId(group.id);
      setGroups([group]);
      await resolveNames(group.members.map((m) => m.userId));
    } finally {
      setJoiningMap((prev) => ({ ...prev, [groupId]: false }));
    }
  }

  function handleLeaveGroup() {
    localStorage.removeItem("currentGroupId");
    setCurrentGroupId(null);
    setGroups(null);
    setMessages([]);
  }

  function handleSignOut() {
    localStorage.removeItem("userId");
    router.push("/");
  }

  if (loadingUser) {
    return (
      <div className="relative z-10 min-h-screen">
        <TopMarquee />
        <div className="max-w-[1400px] mx-auto px-10 pt-32 flex items-center gap-4">
          <div className="shimmer w-48 h-4 rounded-none"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isAvailableToday = user.todayAvailability?.isAvailable === true;
  const userInitials = user.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const primarySkill = user.sportPreferences[0]?.skill ?? "Athlete";

  return (
    <div className="relative z-10 min-h-screen">
      <TopMarquee />

      <main className="min-h-screen pb-20">
        {/* Sticky header */}
        <header
          className="border-b sticky top-0 z-30 backdrop-blur"
          style={{ background: "rgba(10,10,10,0.85)", borderColor: "var(--border)" }}
        >
          <div className="max-w-[1400px] mx-auto px-10 py-5 flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-5">
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="text-right">
                    <div className="text-sm font-bold leading-none">{user.name}</div>
                    <div className="text-[10px] font-mono-s2m tracker-wide mt-1" style={{ color: "var(--muted)" }}>
                      {primarySkill.toUpperCase()} · ACTIVE
                    </div>
                  </div>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-11 h-11 font-display uppercase text-xl flex items-center justify-center"
                      style={{ background: "var(--volt)", color: "black" }}
                    >
                      {userInitials}
                    </div>
                  )}
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-44 border z-50"
                    style={{ background: "var(--surface-2)", borderColor: "var(--border-strong)" }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                      <div className="font-mono-s2m text-[10px] tracker-wide" style={{ color: "var(--muted)" }}>
                        SIGNED IN AS
                      </div>
                      <div className="text-sm font-bold mt-0.5 truncate">{user.name}</div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 font-mono-s2m text-[11px] tracker-wide transition-colors hover:opacity-70"
                      style={{ color: "var(--orange)" }}
                    >
                      LOG OUT →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero — ShowUp toggle */}
        <section className="max-w-[1400px] mx-auto px-10 pt-14">
          <div className="grid grid-cols-12 gap-8">
            {/* Left meta */}
            <div className="col-span-12 lg:col-span-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4 text-xs font-bold tracker-wide" style={{ color: "var(--muted)" }}>
                  <span className="w-8 h-px" style={{ background: "var(--border-strong)" }}></span>
                  TODAY · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "2-digit" }).toUpperCase()}
                </div>
                <div className="font-display uppercase text-7xl tracker-tight leading-[0.85]">
                  Your<br />
                  <span style={{ color: "var(--volt)" }}>Zone</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: "var(--muted)" }}>
                  Toggle your availability. The crew is scanning. Don&apos;t go dark.
                </p>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-3 mt-10">
                <StatCard label="SPORTS" value={String(user.sportPreferences.length).padStart(2, "0")} />
                <StatCard label="STATUS" value={isAvailableToday ? "IN" : "OFF"} />
                <StatCard label="GROUPS" value={String(groups?.length ?? 0).padStart(2, "0")} />
                <StatCard label="LEVEL" value={primarySkill.slice(0, 3).toUpperCase()} />
              </div>
            </div>

            {/* Massive toggle */}
            <div className="col-span-12 lg:col-span-9">
              <ShowUpToggle on={isAvailableToday} onToggle={handleToggle} loading={toggling} />
            </div>
          </div>
        </section>

        {/* Find My Group */}
        <section className="max-w-[1400px] mx-auto px-10 mt-20">
          <div className="grid grid-cols-12 gap-8 items-end mb-8">
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center gap-3 mb-4 text-xs font-bold tracker-wide" style={{ color: "var(--volt)" }}>
                <span className="w-8 h-px" style={{ background: "var(--volt)" }}></span>
                MATCH ENGINE
              </div>
              <h2 className="font-display uppercase text-7xl tracker-tight leading-[0.9]">
                Find your<br />crew.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <button
                onClick={handleFindGroup}
                disabled={matchLoading}
                className="w-full border-2 group transition-all disabled:opacity-70"
                style={
                  matchLoading
                    ? { borderColor: "var(--volt)", background: "var(--surface)", cursor: "wait" }
                    : { borderColor: "white", background: "white", color: "black" }
                }
              >
                <div className="flex items-center justify-between px-7 py-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 flex items-center justify-center"
                      style={
                        matchLoading
                          ? { color: "var(--volt)" }
                          : { background: "black", color: "white" }
                      }
                    >
                      <IconSearch className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-display uppercase text-3xl tracker-tight leading-none">
                        {matchLoading ? "Scanning…" : "Find My Group"}
                      </div>
                      <div
                        className="text-[10px] font-mono-s2m tracker-wide mt-1"
                        style={{ color: matchLoading ? "var(--muted)" : "var(--muted-2)" }}
                      >
                        {matchLoading ? "CROSS-REFERENCING ATHLETES" : "MATCH ME WITH NEARBY ATHLETES"}
                      </div>
                    </div>
                  </div>
                  <IconArrow
                    className="w-7 h-7 transition-transform group-hover:translate-x-2"
                    style={matchLoading ? { color: "var(--volt)" } : undefined}
                  />
                </div>
                {matchLoading && <div className="h-1 stripes-volt"></div>}
              </button>
            </div>
          </div>

          {/* Results */}
          {groups !== null && (
            groups.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {groups.map((group, i) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    index={i}
                    nameMap={nameMap}
                    currentUserId={user.id}
                    userLocation={user.location}
                    venues={venueMap[group.id] ?? null}
                    venueLoading={venueLoadingMap[group.id] ?? false}
                    onFindVenues={() => handleFindVenues(group.id, group.sport)}
                    locked={lockedMap[group.id] ?? false}
                    locking={lockingMap[group.id] ?? false}
                    onLockIn={() => handleLockIn(group.id)}
                    detailsOpen={detailsOpenMap[group.id] ?? false}
                    onToggleDetails={() => setDetailsOpenMap((prev) => ({ ...prev, [group.id]: !prev[group.id] }))}
                    selectingVenue={selectingVenueMap[group.id] ?? false}
                    onSelectVenue={(venueName) => handleSelectVenue(group.id, venueName)}
                    messages={messages}
                    chatInput={chatInput}
                    onChatInput={setChatInput}
                    onSendMessage={sendMessage}
                    onLeave={handleLeaveGroup}
                  />
                ))}
              </div>
            )
          )}
        </section>

        {/* Create Event */}
        <section className="max-w-[1400px] mx-auto px-10 mt-20">
          <div className="grid grid-cols-12 gap-8 items-end mb-8">
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center gap-3 mb-4 text-xs font-bold tracker-wide" style={{ color: "var(--volt)" }}>
                <span className="w-8 h-px" style={{ background: "var(--volt)" }} />
                CAPTAIN MODE
              </div>
              <h2 className="font-display uppercase text-7xl tracker-tight leading-[0.9]">
                Start your<br />own crew.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5">
              {!showCreateEvent ? (
                <button
                  onClick={() => setShowCreateEvent(true)}
                  className="w-full border-2 group transition-all text-left"
                  style={{ borderColor: "var(--volt)", background: "transparent", color: "var(--volt)" }}
                >
                  <div className="flex items-center justify-between px-7 py-6">
                    <span className="font-display uppercase text-3xl tracker-tight leading-none">Create Event</span>
                    <IconArrow className="w-7 h-7 transition-transform group-hover:translate-x-2" />
                  </div>
                </button>
              ) : (
                <div className="border-2 p-6 flex flex-col gap-4" style={{ borderColor: "var(--volt)" }}>
                  <div className="font-mono-s2m text-[10px] tracker-wide" style={{ color: "var(--volt)" }}>
                    NEW EVENT
                  </div>
                  <div>
                    <label className="block font-mono-s2m text-[11px] tracker-wide mb-2" style={{ color: "var(--muted)" }}>SPORT</label>
                    <select
                      className="athletic w-full border px-4 py-3 text-sm focus:outline-none"
                      style={{ background: "var(--surface-2)", borderColor: "var(--border-strong)", color: "var(--fg)" }}
                      value={createSport}
                      onChange={(e) => setCreateSport(e.target.value)}
                    >
                      {["football", "basketball", "tennis", "running"].map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono-s2m text-[11px] tracker-wide mb-2" style={{ color: "var(--muted)" }}>DESCRIPTION <span style={{ color: "var(--muted-2)" }}>/ OPTIONAL</span></label>
                    <input
                      type="text"
                      value={createDescription}
                      onChange={(e) => setCreateDescription(e.target.value)}
                      placeholder="e.g. Casual 5-a-side, all levels welcome"
                      className="w-full border px-4 py-3 text-sm focus:outline-none placeholder:text-neutral-600"
                      style={{ background: "var(--surface-2)", borderColor: "var(--border-strong)", color: "var(--fg)" }}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCreateEvent}
                      disabled={creating}
                      className="flex-1 py-3 font-display uppercase text-xl tracker-tight transition-opacity disabled:opacity-50"
                      style={{ background: "var(--volt)", color: "black" }}
                    >
                      {creating ? "Creating…" : "Create →"}
                    </button>
                    <button
                      onClick={() => setShowCreateEvent(false)}
                      className="px-5 py-3 font-mono-s2m text-[11px] tracker-wide border transition-opacity hover:opacity-70"
                      style={{ borderColor: "var(--border-strong)", color: "var(--muted)" }}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Browse Groups */}
        <section className="max-w-[1400px] mx-auto px-10 mt-20">
          <div className="grid grid-cols-12 gap-8 items-end mb-8">
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center gap-3 mb-4 text-xs font-bold tracker-wide" style={{ color: "var(--volt)" }}>
                <span className="w-8 h-px" style={{ background: "var(--volt)" }} />
                OPEN ROSTER
              </div>
              <h2 className="font-display uppercase text-7xl tracker-tight leading-[0.9]">
                Browse<br />groups.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <button
                onClick={handleLoadOpenGroups}
                disabled={loadingOpenGroups}
                className="w-full border-2 group transition-all disabled:opacity-70"
                style={{ borderColor: "white", background: "white", color: "black" }}
              >
                <div className="flex items-center justify-between px-7 py-6">
                  <span className="font-display uppercase text-3xl tracker-tight leading-none">
                    {loadingOpenGroups ? "Loading…" : "Browse Groups"}
                  </span>
                  <IconArrow className="w-7 h-7 transition-transform group-hover:translate-x-2" />
                </div>
              </button>
            </div>
          </div>

          {openGroups !== null && (
            openGroups.length === 0 ? (
              <div className="border px-8 py-10 text-center font-mono-s2m text-[11px] tracker-wide" style={{ borderColor: "var(--border-strong)", color: "var(--muted)" }}>
                NO OPEN GROUPS RIGHT NOW — CREATE ONE ABOVE.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {openGroups.map((g) => {
                  const isOwn = groups?.some((myG) => myG.id === g.id);
                  return (
                    <div key={g.id} className="border flex flex-col" style={{ borderColor: "var(--border-strong)", background: "var(--surface)" }}>
                      <div className="px-5 pt-5 pb-4 flex-1">
                        <div className="font-mono-s2m text-[10px] tracker-wide mb-2" style={{ color: "var(--volt)" }}>
                          {g.sport.toUpperCase()} · {g.memberCount} MEMBER{g.memberCount !== 1 ? "S" : ""}
                        </div>
                        <div className="font-display uppercase text-3xl tracker-tight leading-none capitalize mb-2">
                          {g.sport}
                        </div>
                        {g.description && (
                          <div className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>
                            {g.description}
                          </div>
                        )}
                        <div className="mt-3 font-mono-s2m text-[10px] tracker-wide" style={{ color: "var(--muted-2)" }}>
                          CAPTAIN: {g.captainName.toUpperCase()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinGroup(g.id)}
                        disabled={joiningMap[g.id] || isOwn}
                        className="border-t px-5 py-3 font-mono-s2m text-[11px] tracker-wide text-left transition-opacity hover:opacity-70 disabled:opacity-40"
                        style={{ borderColor: "var(--border-strong)", color: isOwn ? "var(--muted-2)" : "var(--volt)" }}
                      >
                        {joiningMap[g.id] ? "JOINING…" : isOwn ? "ALREADY JOINED" : "JOIN →"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </section>

        {/* Footer */}
        <footer
          className="max-w-[1400px] mx-auto px-10 mt-32 pt-10 border-t flex flex-wrap justify-between items-center text-[10px] font-mono-s2m tracker-wide"
          style={{ borderColor: "var(--border)", color: "var(--muted-2)" }}
        >
          <div>© 2026 SHOWUP2MOVE · ALL ATHLETES WELCOME</div>
          <div className="flex gap-6">
            <span>SYSTEM OK</span>
            <span>UPTIME 99.97%</span>
            <span>v 2.6.1</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
