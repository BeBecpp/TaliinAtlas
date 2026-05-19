import type { AtlasData, AtlasEdge, AtlasNodeData } from "@/types/atlas";
import { atlasDataSchema } from "./atlasSchema";

function toKebab(id: string): string {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeAtlas(atlas: AtlasData & { recommendedPath?: string[] }): AtlasData & {
  recommendedPath: string[];
} {
  const seen = new Set<string>();
  const nodes: AtlasNodeData[] = atlas.nodes.map((node, index) => {
    let id = toKebab(node.id);
    if (seen.has(id)) id = `${id}-${index}`;
    seen.add(id);
    return {
      ...node,
      id,
      status: index === 0 ? "available" : node.status === "completed" ? "completed" : "locked",
      prerequisites: index === 0 ? [] : node.prerequisites.map(toKebab),
      unlocks: node.unlocks.map(toKebab),
      quizOptions: node.quizOptions.slice(0, 4),
      correctAnswer: Math.min(Math.max(0, node.correctAnswer), 3),
    };
  });

  const idMap = new Map(atlas.nodes.map((n, i) => [n.id, nodes[i].id]));

  const edges: AtlasEdge[] = [];
  for (let i = 1; i < nodes.length; i++) {
    edges.push({
      id: `e-${nodes[i - 1].id}-${nodes[i].id}`,
      source: nodes[i - 1].id,
      target: nodes[i].id,
    });
  }

  const nodeIds = new Set(nodes.map((n) => n.id));
  let recommendedPath =
    atlas.recommendedPath?.map((id) => idMap.get(id) ?? toKebab(id)).filter((id) => nodeIds.has(id)) ??
    nodes.filter((n) => !n.isMastery).map((n) => n.id);

  if (recommendedPath.length === 0) recommendedPath = [nodes[0].id];

  for (let i = 0; i < nodes.length; i++) {
    const next = nodes[i + 1];
    nodes[i].unlocks = next ? [next.id] : [];
    if (i > 0) nodes[i].prerequisites = [nodes[i - 1].id];
  }

  const normalized = {
    ...atlas,
    id: toKebab(atlas.id) || `atlas-${Date.now().toString(36)}`,
    nodes,
    edges,
    recommendedPath,
  };

  const parsed = atlasDataSchema.safeParse(normalized);
  if (!parsed.success) {
    console.warn("Atlas validation warnings:", parsed.error.flatten());
  }

  return normalized;
}
