import { NextResponse } from "next/server";
import { generateAtlas } from "@/lib/ai/generateAtlas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = String(body.input ?? "").trim();
    const mode = body.mode ? String(body.mode) : "Beginner";

    if (!input) {
      return NextResponse.json(
        { success: false, error: "Input is required." },
        { status: 400 }
      );
    }

    const result = generateAtlas({ input, mode, provider: "custom-ml" });

    return NextResponse.json({
      success: true,
      engine: result.engine,
      classification: result.classification,
      atlas: result.atlas,
    });
  } catch (error) {
    console.error("generate-atlas error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate atlas." },
      { status: 500 }
    );
  }
}
