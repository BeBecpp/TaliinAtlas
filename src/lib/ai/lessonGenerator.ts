import type { TopicCategory } from "@/lib/ml/types";
import type { ConceptBlueprint, GenerationMode } from "./types";
import { getCategoryDefinition } from "@/data/ml/categoryDefinitions";

interface LessonInput {
  category: TopicCategory;
  concept: ConceptBlueprint;
  topic: string;
  mode: GenerationMode;
}

export interface LessonContent {
  summary: string;
  explanation: string;
  example: string;
  explainVariants: {
    simple: string;
    example: string;
    eli12: string;
    mongolian: string;
  };
}

const MODE_INTROS: Record<GenerationMode, string> = {
  Beginner: "Let's break this down step by step.",
  Intermediate: "Here's how this concept fits into the bigger picture.",
  "Fast Review": "Quick recap:",
  "Exam Prep": "For exams, remember:",
  "Coding Practice": "In code, you'll use this like so:",
};

export function generateLessonContent(input: LessonInput): LessonContent {
  const { category, concept, topic, mode } = input;
  const cat = getCategoryDefinition(category);
  const intro = MODE_INTROS[mode];

  const summary =
    mode === "Fast Review"
      ? `${concept.title}: core idea for "${topic}".`
      : `${concept.title} — a key step in your ${cat.label} learning path for "${topic}".`;

  const explanation =
    mode === "Exam Prep"
      ? `${intro} **${concept.title}** — Definition: essential ${cat.label} concept. Why: unlocks next topics. Common trap: skipping prerequisites.`
      : `${intro} **${concept.title}** helps you progress in ${cat.label}. ${cat.description} Mastering this concept strengthens your understanding of "${topic}".`;

  const example = buildExample(category, concept, mode);

  return {
    summary,
    explanation,
    example,
    explainVariants: {
      simple: `Simply put, ${concept.title} is a building block for ${cat.label}. ${intro}`,
      example: `Example focus: see the sample below for ${concept.title} applied to "${topic}".`,
      eli12: `Imagine ${concept.title} like a level in a game — you need it before the next map opens!`,
      mongolian: `«${concept.title}» нь ${cat.label} сурах замын чухал алхам. "${topic}" сэдвийг ойлгоход энэ ойлголт тусална.`,
    },
  };
}

function buildExample(
  category: TopicCategory,
  concept: ConceptBlueprint,
  mode: GenerationMode
): string {
  if (category === "react" && concept.title.includes("useState")) {
    return `const [count, setCount] = useState(0);
return <button onClick={() => setCount(count + 1)}>{count}</button>;`;
  }
  if (category === "javascript-async") {
    return `async function load() {
  const res = await fetch("/api/data");
  return res.json();
}`;
  }
  if (category === "git") {
    return `git checkout -b feature/atlas
git add .
git commit -m "Add ${concept.title} notes"`;
  }
  if (category === "database") {
    return `SELECT ${concept.title.toLowerCase().replace(/\s/g, "_")}
FROM topics
WHERE topic = '${concept.title}';`;
  }
  if (mode === "Coding Practice" || category === "programming-basics") {
    return `// ${concept.title}
function demo() {
  console.log("Learning: ${concept.title}");
}
demo();`;
  }
  if (category === "math-basics") {
    return `# ${concept.title}
x = 3
y = 2 * x + 1  # practice equation`;
  }
  return `// Practice: ${concept.title}
// Apply this concept to: your ${category} study goal`;
}
