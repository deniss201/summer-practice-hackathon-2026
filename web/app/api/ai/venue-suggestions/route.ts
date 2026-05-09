import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

interface Venue {
  name: string;
  address: string;
  estimatedPrice: string;
  notes: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const sport: string | undefined = body?.sport;
    const location: string | undefined = body?.location;
    console.log("[venue-suggestions] received:", { sport, location });

    if (!sport || typeof sport !== "string" || sport.trim().length === 0) {
      return NextResponse.json({ error: "sport is required" }, { status: 400 });
    }
    if (!location || typeof location !== "string" || location.trim().length === 0) {
      return NextResponse.json({ error: "location is required" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const prompt =
      `Suggest 3 realistic venues for playing ${sport} in ${location}. ` +
      `Return ONLY a valid JSON array, no markdown, no backticks, no explanation. ` +
      `Format: [{name, address, estimatedPrice, notes}]. ` +
      `estimatedPrice should be a rough cost per person per session. ` +
      `notes should be one short practical tip.`;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 256,
    });
    const text = completion.choices[0].message.content ?? "[]";

    console.log("[venue-suggestions] raw AI response:", text);

    let venues: Venue[] = [];
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      const match = clean.match(/\[[\s\S]*\]/);
      const jsonStr = match ? match[0] : "[]";
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        venues = parsed.filter(
          (item): item is Venue =>
            typeof item?.name === "string" &&
            typeof item?.address === "string" &&
            typeof item?.estimatedPrice === "string" &&
            typeof item?.notes === "string"
        );
      }
    } catch {
      venues = [];
    }

    return NextResponse.json({ venues });
  } catch (err) {
    console.error("[venue-suggestions] Unhandled error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
