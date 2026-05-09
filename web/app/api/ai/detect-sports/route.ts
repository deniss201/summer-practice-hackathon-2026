import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

interface SportResult {
  sport: string;
  skill: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const bio: string | undefined = body?.bio;

    if (!bio || typeof bio !== "string" || bio.trim().length === 0) {
      return NextResponse.json({ error: "bio is required" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const prompt =
      `Based on this user bio, identify which of these sports they might be interested in: ` +
      `football, basketball, tennis, running. For each detected sport, assign a skill level ` +
      `(beginner/intermediate/advanced) based on any hints in the bio. Return only a JSON array ` +
      `like: [{sport, skill}]. If no sports are detected, return []. Bio: ${bio}`;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 256,
    });
    const text = completion.choices[0].message.content ?? "[]";

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
  } catch (err) {
    console.error("[detect-sports] error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json(
      { error: "Internal server error", details: String(err) },
      { status: 500 }
    );
  }
}
