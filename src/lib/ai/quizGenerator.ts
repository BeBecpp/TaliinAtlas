import type { TopicCategory } from "@/lib/ml/types";
import type { ConceptBlueprint, GenerationMode } from "./types";

interface QuizInput {
  category: TopicCategory;
  concept: ConceptBlueprint;
  topic: string;
  mode: GenerationMode;
}

export interface GeneratedQuiz {
  quizQuestion: string;
  quizOptions: string[];
  correctAnswer: number;
}

const DISTRACTORS: Partial<Record<TopicCategory, string[]>> = {
  react: ["Vue components only", "CSS selectors", "SQL queries", "Git branches"],
  "javascript-async": ["Synchronous blocking only", "CSS animations", "HTML tags", "Binary trees"],
  git: ["npm install", "CSS flexbox", "SQL JOIN", "React hooks"],
  database: ["React state", "Git merge", "CSS grid", "Promises"],
  algorithms: ["CSS styling", "Git commit", "HTML forms", "useEffect"],
  "system-design-basics": ["CSS variables", "JSX only", "for loops only", "Git stash"],
  "web-development": ["Binary search only", "Git rebase only", "SQL indexes only", "Recursion only"],
  "programming-basics": ["Deploy to CDN only", "Git pull requests", "SQL views", "Load balancers"],
  "study-generic": ["Skip review entirely", "Ignore prerequisites", "Never practice", "Avoid summaries"],
  "math-basics": ["Git workflows", "API gateways", "React props", "Docker layers"],
};

export function generateQuiz(input: QuizInput): GeneratedQuiz {
  const { category, concept } = input;
  const correctText = `It defines how ${concept.title} works in this learning path`;

  const question =
    input.mode === "Exam Prep"
      ? `Which statement best describes "${concept.title}"?`
      : `What is the main purpose of "${concept.title}" in this atlas?`;

  const pool = DISTRACTORS[category] ?? DISTRACTORS["study-generic"]!;
  const distractors = [
    pool[0],
    pool[1],
    `It is unrelated to ${concept.title}`,
  ];

  const options = [correctText, ...distractors.slice(0, 3)];
  // shuffle deterministically by concept id
  const seed = concept.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const shuffled = [...options].sort(
    (a, b) => ((a.length + seed) % 4) - ((b.length + seed) % 4)
  );
  const correctAnswer = shuffled.indexOf(correctText);

  return {
    quizQuestion: question,
    quizOptions: shuffled,
    correctAnswer: correctAnswer >= 0 ? correctAnswer : 0,
  };
}
