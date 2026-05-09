import { NextResponse } from "next/server";
import { runMatching } from "@/lib/matching";

export async function POST() {
  try {
    const groups = await runMatching();
    return NextResponse.json({ groups, count: groups.length });
  } catch (error) {
    console.error("[match/run]", error);
    return NextResponse.json(
      { error: "Matching failed" },
      { status: 500 }
    );
  }
}
