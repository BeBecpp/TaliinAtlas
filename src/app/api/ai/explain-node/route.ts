import { NextResponse } from "next/server";
import { explainNodeLocally } from "@/lib/ai/localExplanationEngine";
import type { AtlasNodeData } from "@/types/atlas";
import type { ExplainMode } from "@/types/atlas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const node = body.node as AtlasNodeData | undefined;
    const mode = (body.mode ?? "simple") as ExplainMode;

    if (!node?.title) {
      return NextResponse.json(
        { success: false, error: "Node payload is required." },
        { status: 400 }
      );
    }

    const explanation = explainNodeLocally(node, mode);

    return NextResponse.json({ success: true, explanation });
  } catch (error) {
    console.error("explain-node error:", error);
    return NextResponse.json(
      { success: false, error: "Explanation failed." },
      { status: 500 }
    );
  }
}
