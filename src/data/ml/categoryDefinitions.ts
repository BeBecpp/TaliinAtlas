import type { TopicCategory } from "@/lib/ml/types";

export interface CategoryDefinition {
  id: TopicCategory;
  label: string;
  description: string;
  signalKeywords: string[];
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    id: "react",
    label: "React",
    description: "Component-based UI library for building interactive web apps.",
    signalKeywords: [
      "react",
      "jsx",
      "hook",
      "usestate",
      "useeffect",
      "component",
      "props",
      "redux",
      "vite",
      "nextjs",
    ],
  },
  {
    id: "javascript-async",
    label: "JavaScript Async",
    description: "Asynchronous JavaScript patterns including promises and async/await.",
    signalKeywords: [
      "async",
      "await",
      "promise",
      "callback",
      "fetch",
      "then",
      "eventloop",
      "nonblocking",
      "asynchronous",
    ],
  },
  {
    id: "git",
    label: "Git & GitHub",
    description: "Version control workflows, branches, merges, and collaboration.",
    signalKeywords: [
      "git",
      "github",
      "commit",
      "branch",
      "merge",
      "pull",
      "push",
      "rebase",
      "clone",
      "conflict",
    ],
  },
  {
    id: "database",
    label: "Databases",
    description: "Relational data modeling, SQL, and query fundamentals.",
    signalKeywords: [
      "sql",
      "database",
      "table",
      "query",
      "join",
      "postgres",
      "mysql",
      "schema",
      "primary",
      "relation",
    ],
  },
  {
    id: "programming-basics",
    label: "Programming Basics",
    description: "Core programming concepts for absolute beginners.",
    signalKeywords: [
      "variable",
      "loop",
      "function",
      "condition",
      "beginner",
      "syntax",
      "code",
      "program",
      "debug",
    ],
  },
  {
    id: "web-development",
    label: "Web Development",
    description: "HTML, CSS, JavaScript, and full-stack web foundations.",
    signalKeywords: [
      "html",
      "css",
      "dom",
      "browser",
      "website",
      "frontend",
      "backend",
      "http",
      "deploy",
      "responsive",
    ],
  },
  {
    id: "algorithms",
    label: "Algorithms",
    description: "Problem solving, complexity, and classic data structures.",
    signalKeywords: [
      "algorithm",
      "sort",
      "search",
      "binary",
      "recursion",
      "bigo",
      "complexity",
      "array",
      "stack",
      "queue",
      "tree",
    ],
  },
  {
    id: "system-design-basics",
    label: "System Design",
    description: "Scalable architecture concepts for backend systems.",
    signalKeywords: [
      "system",
      "design",
      "cache",
      "load",
      "balancer",
      "scale",
      "microservice",
      "queue",
      "reliability",
      "architecture",
    ],
  },
  {
    id: "study-generic",
    label: "Study Skills",
    description: "General learning paths from messy notes and study goals.",
    signalKeywords: [
      "study",
      "exam",
      "notes",
      "learn",
      "prepare",
      "review",
      "plan",
      "course",
      "topic",
      "understand",
    ],
  },
  {
    id: "math-basics",
    label: "Math Basics",
    description: "Foundational mathematics for learners.",
    signalKeywords: [
      "math",
      "algebra",
      "equation",
      "graph",
      "ratio",
      "percent",
      "fraction",
      "geometry",
      "calculus",
      "number",
    ],
  },
];

export function getCategoryDefinition(category: TopicCategory): CategoryDefinition {
  const found = CATEGORY_DEFINITIONS.find((c) => c.id === category);
  if (!found) throw new Error(`Unknown category: ${category}`);
  return found;
}
