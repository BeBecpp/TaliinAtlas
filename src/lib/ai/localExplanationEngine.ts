import type { AtlasNodeData } from "@/types/atlas";
import type { ExplainMode } from "@/types/atlas";

export function explainNodeLocally(
  node: AtlasNodeData,
  mode: ExplainMode
): string {
  const variants = node.explainVariants;
  switch (mode) {
    case "simple":
      return (
        variants?.simple ??
        `Simply put: ${node.title} — ${node.summary}`
      );
    case "example":
      return (
        variants?.example ??
        `Focus on the example below for "${node.title}". Trace each line and relate it to: ${node.summary}`
      );
    case "eli12":
      return (
        variants?.eli12 ??
        `Imagine "${node.title}" is one level in a game. You clear it to unlock the next map! ${node.summary}`
      );
    case "mongolian":
      return (
        variants?.mongolian ??
        `«${node.title}» гэдэг нь: ${node.summary} Энэ ойлголтыг жишээн дээрээ хэрэгжүүлж үзээрэй.`
      );
    default:
      return node.explanation;
  }
}
