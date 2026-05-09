import { NextRequest, NextResponse } from "next/server";

interface SportResult {
  sport: string;
  skill: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const bio: string | undefined = body?.bio;

  if (!bio || typeof bio !== "string" || bio.trim().length === 0) {
    return NextResponse.json({ error: "bio is required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const prompt =
    `Based on this user bio, identify which of these sports they might be interested in: ` +
    `football, basketball, tennis, running. For each detected sport, assign a skill level ` +
    `(beginner/intermediate/advanced) based on any hints in the bio. Return only a JSON array ` +
    `like: [{sport, skill}]. If no sports are detected, return []. Bio: ${bio}`;

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    console.error("[detect-sports] Anthropic error:", err);
    return NextResponse.json(
      { error: "Failed to contact AI service" },
      { status: 502 }
    );
  }

  const anthropicData = await anthropicRes.json();
  const text: string = anthropicData.content?.[0]?.text ?? "[]";

  let sports: SportResult[] = [];
  try {
    const match = text.match(/\[[\s\S]*\]/);
    const jsonStr = match ? match[0] : "[]";
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      sports = parsed.filter(
        (item): item is SportResult =>
          typeof item?.sport === "string" && typeof item?.skill === "string"
      );
    }
  } catch {
    sports = [];
  }

  return NextResponse.json({ sports });
}
