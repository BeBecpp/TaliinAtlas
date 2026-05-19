import type { GenerationMode } from "./types";
import type { LearningMode } from "@/types/atlas";

export function learningModeToGeneration(mode: LearningMode): GenerationMode {
  switch (mode) {
    case "guided":
      return "Intermediate";
    case "challenge":
      return "Exam Prep";
    default:
      return "Beginner";
  }
}
