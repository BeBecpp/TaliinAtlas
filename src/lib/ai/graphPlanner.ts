import type { AtlasData, AtlasEdge, AtlasNodeData } from "@/types/atlas";
import type { AtlasTemplate, GenerationMode } from "./types";
import { formatTemplateText } from "./atlasTemplates";
import { generateLessonContent } from "./lessonGenerator";
import { generateQuiz } from "./quizGenerator";

export interface PlannedGraph {
  atlas: AtlasData;
  recommendedPath: string[];
}

export function planGraph(
  template: AtlasTemplate,
  topic: string,
  mode: GenerationMode
): PlannedGraph {
  const concepts = template.concepts;
  const nodes: AtlasNodeData[] = concepts.map((concept, index) => {
    const prev = concepts[index - 1];
    const prerequisites = prev && !concept.isMastery ? [prev.id] : index > 0 && concept.isMastery
      ? [concepts[concepts.length - 2].id]
      : index > 0
        ? [concepts[index - 1].id]
        : [];

    const next = concepts[index + 1];
    const unlocks = next ? [next.id] : [];

    const lesson = generateLessonContent({
      category: template.category,
      concept,
      topic,
      mode,
    });
    const quiz = generateQuiz({
      category: template.category,
      concept,
      topic,
      mode,
    });

    const row = index % 3;
    const col = Math.floor(index / 3);

    return {
      id: concept.id,
      title: concept.title,
      level: concept.level,
      status: index === 0 ? "available" : "locked",
      summary: lesson.summary,
      explanation: lesson.explanation,
      example: lesson.example,
      prerequisites: index === 0 ? [] : prerequisites,
      quizQuestion: quiz.quizQuestion,
      quizOptions: quiz.quizOptions,
      correctAnswer: quiz.correctAnswer,
      unlocks,
      position: {
        x: concept.level * 220,
        y: row * 160 + col * 20,
      },
      isMastery: concept.isMastery,
      explainVariants: lesson.explainVariants,
    };
  });

  const edges: AtlasEdge[] = [];
  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    edges.push({
      id: `e-${prev.id}-${curr.id}`,
      source: prev.id,
      target: curr.id,
    });
  }

  const atlasId = `${template.category}-${Date.now().toString(36)}`;
  const atlas: AtlasData = {
    id: atlasId,
    topic: formatTemplateText(template.titlePattern, topic),
    description: formatTemplateText(template.descriptionPattern, topic),
    nodes,
    edges,
  };

  const recommendedPath = nodes.filter((n) => !n.isMastery).map((n) => n.id);

  return { atlas, recommendedPath };
}
