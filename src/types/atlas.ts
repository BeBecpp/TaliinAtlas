export type NodeStatus = "locked" | "available" | "completed";

export type LearningMode = "explore" | "guided" | "challenge";

export type ExplainMode =
  | "default"
  | "simple"
  | "example"
  | "eli12"
  | "mongolian";

export interface AtlasNodeData {
  id: string;
  title: string;
  level: number;
  status: NodeStatus;
  summary: string;
  explanation: string;
  example: string;
  prerequisites: string[];
  quizQuestion: string;
  quizOptions: string[];
  correctAnswer: number;
  unlocks: string[];
  position: { x: number; y: number };
  isMastery?: boolean;
  explainVariants?: {
    simple?: string;
    example?: string;
    eli12?: string;
    mongolian?: string;
  };
}

export interface AtlasEdge {
  id: string;
  source: string;
  target: string;
}

export interface AtlasData {
  id: string;
  topic: string;
  description: string;
  nodes: AtlasNodeData[];
  edges: AtlasEdge[];
}

export interface AtlasProgress {
  atlasId: string;
  nodeStatuses: Record<string, NodeStatus>;
  updatedAt: string;
}

export interface ProgressStats {
  completed: number;
  unlocked: number;
  locked: number;
  total: number;
  masteryPercent: number;
  nextRecommended: AtlasNodeData | null;
}
