import { generateWithCustomML, generationModeFromString } from "./customMLProvider";
import { learningModeToGeneration } from "./modes";
import type { GeneratedAtlasResult, GenerationMode } from "./types";
import type { LearningMode } from "@/types/atlas";

export type AtlasProvider = "custom-ml" | "ollama" | "cloud-ai-placeholder";

export function generateAtlas(options: {
  input: string;
  mode?: string | GenerationMode;
  learningMode?: LearningMode;
  provider?: AtlasProvider;
}): GeneratedAtlasResult {
  const provider = options.provider ?? "custom-ml";
  const mode =
    typeof options.mode === "string"
      ? generationModeFromString(options.mode)
      : options.mode ??
        (options.learningMode ? learningModeToGeneration(options.learningMode) : "Beginner");

  if (provider === "custom-ml") {
    return generateWithCustomML(options.input, mode);
  }

  // Placeholder for future providers — fall back to custom ML
  return generateWithCustomML(options.input, mode);
}
