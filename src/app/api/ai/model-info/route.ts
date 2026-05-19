import { NextResponse } from "next/server";
import { getServerModelInfo } from "@/lib/ml/inference.server";

export async function GET() {
  try {
    const model = getServerModelInfo();
    return NextResponse.json({ success: true, model });
  } catch (error) {
    console.error("model-info error:", error);
    return NextResponse.json(
      { success: false, error: "Could not load model info." },
      { status: 500 }
    );
  }
}
