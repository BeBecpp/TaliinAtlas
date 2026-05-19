import { NextResponse } from "next/server";
import { classifyOnServer } from "@/lib/ml/inference.server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = String(body.input ?? "").trim();

    if (!input) {
      return NextResponse.json(
        { success: false, error: "Input is required." },
        { status: 400 }
      );
    }

    const classification = classifyOnServer(input);

    return NextResponse.json({
      success: true,
      classification,
    });
  } catch (error) {
    console.error("classify error:", error);
    return NextResponse.json(
      { success: false, error: "Classification failed." },
      { status: 500 }
    );
  }
}
