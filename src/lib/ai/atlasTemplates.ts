import type { AtlasTemplate } from "./types";
import type { TopicCategory } from "@/lib/ml/types";

function tpl(
  category: TopicCategory,
  titlePattern: string,
  descriptionPattern: string,
  finalGoal: string,
  concepts: AtlasTemplate["concepts"]
): AtlasTemplate {
  return { category, titlePattern, descriptionPattern, finalGoal, concepts };
}

export const ATLAS_TEMPLATES: Record<TopicCategory, AtlasTemplate> = {
  react: tpl(
    "react",
    "{topic} — React Atlas",
    "Master React fundamentals from JSX to custom hooks and a mini project.",
    "Build a small interactive React app using hooks and component composition.",
    [
      { id: "web-components", title: "Web Components", level: 1 },
      { id: "jsx", title: "JSX", level: 2 },
      { id: "props", title: "Props", level: 3 },
      { id: "state", title: "State", level: 4 },
      { id: "use-state", title: "useState", level: 5 },
      { id: "events", title: "Events", level: 6 },
      { id: "use-effect", title: "useEffect", level: 7 },
      { id: "dependency-array", title: "Dependency Array", level: 8 },
      { id: "custom-hooks", title: "Custom Hooks", level: 9 },
      { id: "mini-project", title: "Mini Project", level: 10, isMastery: true },
    ]
  ),
  "javascript-async": tpl(
    "javascript-async",
    "{topic} — Async JavaScript Atlas",
    "Learn asynchronous JavaScript from callbacks to real-world API patterns.",
    "Combine async/await, fetch, and error handling in a capstone flow.",
    [
      { id: "js-basics", title: "JavaScript Basics", level: 1 },
      { id: "callbacks", title: "Callbacks", level: 2 },
      { id: "promises", title: "Promises", level: 3 },
      { id: "fetch-api", title: "Fetch API", level: 4 },
      { id: "async-functions", title: "Async Functions", level: 5 },
      { id: "await", title: "Await", level: 6 },
      { id: "try-catch", title: "Try/Catch", level: 7 },
      { id: "promise-all", title: "Promise.all", level: 8 },
      { id: "real-api-request", title: "Real API Request", level: 9 },
      { id: "mastery-project", title: "Mastery Project", level: 10, isMastery: true },
    ]
  ),
  git: tpl(
    "git",
    "{topic} — Git Atlas",
    "Version control skills from first commit to team workflows on GitHub.",
    "Collaborate on a feature branch with pull requests and clean history.",
    [
      { id: "repository", title: "Repository", level: 1 },
      { id: "commit", title: "Commit", level: 2 },
      { id: "branch", title: "Branch", level: 3 },
      { id: "merge", title: "Merge", level: 4 },
      { id: "remote", title: "Remote", level: 5 },
      { id: "push-pull", title: "Push and Pull", level: 6 },
      { id: "pull-request", title: "Pull Request", level: 7 },
      { id: "conflict-resolution", title: "Conflict Resolution", level: 8 },
      { id: "github-workflow", title: "GitHub Workflow", level: 9 },
      { id: "team-project", title: "Team Project", level: 10, isMastery: true },
    ]
  ),
  database: tpl(
    "database",
    "{topic} — Database Atlas",
    "Relational database concepts from tables to joins and mini projects.",
    "Design and query a small relational schema with confidence.",
    [
      { id: "data", title: "Data", level: 1 },
      { id: "table", title: "Table", level: 2 },
      { id: "row-column", title: "Row and Column", level: 3 },
      { id: "primary-key", title: "Primary Key", level: 4 },
      { id: "relationship", title: "Relationship", level: 5 },
      { id: "sql-select", title: "SQL SELECT", level: 6 },
      { id: "filtering", title: "Filtering", level: 7 },
      { id: "joins", title: "Joins", level: 8 },
      { id: "index-basics", title: "Index Basics", level: 9 },
      { id: "mini-database-project", title: "Mini Database Project", level: 10, isMastery: true },
    ]
  ),
  "programming-basics": tpl(
    "programming-basics",
    "{topic} — Programming Atlas",
    "Core programming building blocks for your first programs.",
    "Write a small program using variables, logic, loops, and functions.",
    [
      { id: "what-is-programming", title: "What is Programming", level: 1 },
      { id: "variables", title: "Variables", level: 2 },
      { id: "data-types", title: "Data Types", level: 3 },
      { id: "conditions", title: "Conditions", level: 4 },
      { id: "loops", title: "Loops", level: 5 },
      { id: "functions", title: "Functions", level: 6 },
      { id: "arrays", title: "Arrays", level: 7 },
      { id: "objects", title: "Objects", level: 8 },
      { id: "debugging", title: "Debugging", level: 9 },
      { id: "mini-program", title: "Mini Program", level: 10, isMastery: true },
    ]
  ),
  "web-development": tpl(
    "web-development",
    "{topic} — Web Dev Atlas",
    "Build websites with HTML, CSS, JavaScript, and deployment basics.",
    "Ship a small portfolio page with interactivity and API data.",
    [
      { id: "internet-basics", title: "Internet Basics", level: 1 },
      { id: "html", title: "HTML", level: 2 },
      { id: "css", title: "CSS", level: 3 },
      { id: "javascript", title: "JavaScript", level: 4 },
      { id: "dom", title: "DOM", level: 5 },
      { id: "forms", title: "Forms", level: 6 },
      { id: "api-requests", title: "API Requests", level: 7 },
      { id: "routing", title: "Routing", level: 8 },
      { id: "deployment", title: "Deployment", level: 9 },
      { id: "portfolio-project", title: "Portfolio Project", level: 10, isMastery: true },
    ]
  ),
  algorithms: tpl(
    "algorithms",
    "{topic} — Algorithms Atlas",
    "Problem solving patterns, complexity, and classic structures.",
    "Solve an algorithm challenge using appropriate data structures.",
    [
      { id: "problem-solving", title: "Problem Solving", level: 1 },
      { id: "big-o", title: "Big O", level: 2 },
      { id: "arrays", title: "Arrays", level: 3 },
      { id: "loops", title: "Loops", level: 4 },
      { id: "searching", title: "Searching", level: 5 },
      { id: "binary-search", title: "Binary Search", level: 6 },
      { id: "sorting", title: "Sorting", level: 7 },
      { id: "recursion", title: "Recursion", level: 8 },
      { id: "data-structures", title: "Data Structures", level: 9 },
      { id: "algorithm-challenge", title: "Algorithm Challenge", level: 10, isMastery: true },
    ]
  ),
  "system-design-basics": tpl(
    "system-design-basics",
    "{topic} — System Design Atlas",
    "Scalable architecture concepts for modern backend systems.",
    "Sketch a resilient architecture with API, database, cache, and queue.",
    [
      { id: "client-server", title: "Client and Server", level: 1 },
      { id: "api", title: "API", level: 2 },
      { id: "database", title: "Database", level: 3 },
      { id: "cache", title: "Cache", level: 4 },
      { id: "queue", title: "Queue", level: 5 },
      { id: "load-balancer", title: "Load Balancer", level: 6 },
      { id: "scaling", title: "Scaling", level: 7 },
      { id: "reliability", title: "Reliability", level: 8 },
      { id: "monitoring", title: "Monitoring", level: 9 },
      { id: "mini-architecture", title: "Mini Architecture", level: 10, isMastery: true },
    ]
  ),
  "study-generic": tpl(
    "study-generic",
    "{topic} — Study Atlas",
    "Transform messy notes into a structured learning path.",
    "Complete a mastery task demonstrating understanding of core ideas.",
    [
      { id: "overview", title: "Overview", level: 1 },
      { id: "key-terms", title: "Key Terms", level: 2 },
      { id: "core-ideas", title: "Core Ideas", level: 3 },
      { id: "prerequisites", title: "Prerequisites", level: 4 },
      { id: "basic-example", title: "Basic Example", level: 5 },
      { id: "common-mistakes", title: "Common Mistakes", level: 6 },
      { id: "practice", title: "Practice", level: 7 },
      { id: "review", title: "Review", level: 8 },
      { id: "real-world-use", title: "Real World Use", level: 9 },
      { id: "mastery-task", title: "Mastery Task", level: 10, isMastery: true },
    ]
  ),
  "math-basics": tpl(
    "math-basics",
    "{topic} — Math Atlas",
    "Foundational math skills with practice and mastery review.",
    "Apply concepts to word problems and a mastery review set.",
    [
      { id: "numbers", title: "Numbers", level: 1 },
      { id: "variables", title: "Variables", level: 2 },
      { id: "equations", title: "Equations", level: 3 },
      { id: "functions", title: "Functions", level: 4 },
      { id: "graphs", title: "Graphs", level: 5 },
      { id: "ratios", title: "Ratios", level: 6 },
      { id: "percentages", title: "Percentages", level: 7 },
      { id: "word-problems", title: "Word Problems", level: 8 },
      { id: "practice", title: "Practice", level: 9 },
      { id: "mastery-review", title: "Mastery Review", level: 10, isMastery: true },
    ]
  ),
};

export function getTemplate(category: TopicCategory): AtlasTemplate {
  return ATLAS_TEMPLATES[category] ?? ATLAS_TEMPLATES["study-generic"];
}

export function formatTemplateText(pattern: string, topic: string): string {
  return pattern.replace(/\{topic\}/g, topic.trim() || "Your Learning Topic");
}
