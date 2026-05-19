import type { AtlasData } from "@/types/atlas";

export const sampleAtlas: AtlasData = {
  id: "js-async-atlas",
  topic: "JavaScript Async Atlas",
  description:
    "Master asynchronous JavaScript from callbacks to real-world API patterns.",
  nodes: [
    {
      id: "js-basics",
      title: "JavaScript Basics",
      level: 1,
      status: "available",
      summary: "Functions, variables, and how JavaScript runs code.",
      explanation:
        "Before async patterns, you need a solid grasp of functions, scope, and the call stack. JavaScript is single-threaded: one thing runs at a time unless you delegate work (timers, network, promises).",
      example: `function greet(name) {
  return "Hello, " + name;
}

console.log(greet("Atlas"));`,
      prerequisites: [],
      quizQuestion: "What does JavaScript use to run code by default?",
      quizOptions: [
        "Multiple threads at once",
        "A single call stack",
        "Only Web Workers",
        "GPU shaders",
      ],
      correctAnswer: 1,
      unlocks: ["callbacks"],
      position: { x: 280, y: 0 },
      explainVariants: {
        simple:
          "JavaScript runs one instruction at a time on a single stack—like a single chef in a kitchen.",
        example:
          "Think of greet() pushing onto the stack, returning, then popping off.",
        eli12:
          "Imagine one person doing homework problems one after another—that is the call stack.",
        mongolian:
          "JavaScript нэг thread дээр, call stack-аар дарааллаар код ажиллуулдаг.",
      },
    },
    {
      id: "callbacks",
      title: "Callbacks",
      level: 2,
      status: "locked",
      summary: "Pass functions to run later when async work finishes.",
      explanation:
        "A callback is a function passed as an argument to be invoked later. Timers and event handlers use callbacks. Nested callbacks can create 'callback hell'—hard to read and maintain.",
      example: `setTimeout(() => {
  console.log("Runs after 1 second");
}, 1000);`,
      prerequisites: ["js-basics"],
      quizQuestion: "What problem do deeply nested callbacks often cause?",
      quizOptions: [
        "Faster rendering",
        "Callback hell / hard-to-read code",
        "Automatic type safety",
        "Built-in caching",
      ],
      correctAnswer: 1,
      unlocks: ["promises"],
      position: { x: 80, y: 130 },
      explainVariants: {
        simple: "Callbacks are 'call me when done' functions—simple but messy when stacked.",
        eli12: "Like telling your friend 'text me when you're ready'—many texts get confusing.",
        mongolian: "Callback бол дараа дуудагдах функц; олон давхарлахад уншихад хэцүү болно.",
      },
    },
    {
      id: "promises",
      title: "Promises",
      level: 3,
      status: "locked",
      summary: "Represent future values and chain async steps cleanly.",
      explanation:
        "A Promise is an object representing eventual completion or failure. States: pending, fulfilled, rejected. .then() chains async steps without deep nesting.",
      example: `const p = new Promise((resolve) => {
  setTimeout(() => resolve("done"), 500);
});

p.then((value) => console.log(value));`,
      prerequisites: ["callbacks"],
      quizQuestion: "Which is NOT a Promise state?",
      quizOptions: ["pending", "fulfilled", "rejected", "suspended"],
      correctAnswer: 3,
      unlocks: ["fetch-api", "async-functions"],
      position: { x: 280, y: 260 },
      explainVariants: {
        simple: "Promises are IOUs for future values—you chain .then() instead of nesting.",
        mongolian: "Promise нь ирээдүйн үр дүнг илэрхийлдэг; pending, fulfilled, rejected төлөвтэй.",
      },
    },
    {
      id: "fetch-api",
      title: "Fetch API",
      level: 4,
      status: "locked",
      summary: "Request data from servers over HTTP.",
      explanation:
        "fetch() returns a Promise that resolves to a Response. You typically call .json() on the body. Handle network errors and non-OK status codes explicitly.",
      example: `fetch("https://api.example.com/users")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));`,
      prerequisites: ["promises"],
      quizQuestion: "What does fetch() return?",
      quizOptions: ["A string", "A Promise", "undefined", "A DOM node"],
      correctAnswer: 1,
      unlocks: ["real-api-request"],
      position: { x: 40, y: 400 },
      explainVariants: {
        simple: "fetch talks to servers; you get a Promise back, then parse JSON.",
        mongolian: "fetch() нь Promise буцааж, серверээс өгөгдөл татахад ашиглана.",
      },
    },
    {
      id: "async-functions",
      title: "Async Functions",
      level: 4,
      status: "locked",
      summary: "Declare functions that always return a Promise.",
      explanation:
        "Adding async before a function makes it return a Promise automatically. You can use await inside to pause until a Promise settles—syntax that reads like synchronous code.",
      example: `async function loadUser() {
  const res = await fetch("/api/user");
  return res.json();
}`,
      prerequisites: ["promises"],
      quizQuestion: "What does an async function always return?",
      quizOptions: ["A number", "A Promise", "void only", "A callback"],
      correctAnswer: 1,
      unlocks: ["await", "error-handling"],
      position: { x: 480, y: 400 },
      explainVariants: {
        simple: "async marks a function; it always wraps the return value in a Promise.",
        mongolian: "async функц үргэлж Promise буцаана.",
      },
    },
    {
      id: "await",
      title: "Await",
      level: 5,
      status: "locked",
      summary: "Pause inside async functions until a Promise resolves.",
      explanation:
        "await can only be used inside async functions. It unwraps the fulfilled value or throws on rejection. Sequential awaits run one after another; use Promise.all for parallel work.",
      example: `async function getPosts() {
  const res = await fetch("/api/posts");
  const posts = await res.json();
  return posts;
}`,
      prerequisites: ["async-functions"],
      quizQuestion: "Where can you use await?",
      quizOptions: [
        "Any regular function",
        "Only inside async functions",
        "Global scope only",
        "Inside CSS files",
      ],
      correctAnswer: 1,
      unlocks: ["promise-all"],
      position: { x: 620, y: 530 },
      explainVariants: {
        simple: "await pauses the async function until the Promise is done.",
        mongolian: "await зөвхөн async функц дотор ашиглагдана.",
      },
    },
    {
      id: "error-handling",
      title: "Error Handling",
      level: 5,
      status: "locked",
      summary: "Catch failures with try/catch and .catch().",
      explanation:
        "Rejected Promises and thrown errors in async code should be handled with try/catch around await, or .catch() on chains. Always surface meaningful messages to users.",
      example: `async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (e) {
    console.error("Fetch failed:", e);
    throw e;
  }
}`,
      prerequisites: ["async-functions"],
      quizQuestion: "How do you handle errors in async/await code?",
      quizOptions: [
        "Only console.log",
        "try/catch around await",
        "Delete the Promise",
        "Use var instead of const",
      ],
      correctAnswer: 1,
      unlocks: [],
      position: { x: 280, y: 530 },
      explainVariants: {
        simple: "Wrap await in try/catch—same idea as sync errors, for async failures.",
        mongolian: "async/await алдааг try/catch-ээр барина.",
      },
    },
    {
      id: "promise-all",
      title: "Promise.all",
      level: 6,
      status: "locked",
      summary: "Run multiple Promises in parallel.",
      explanation:
        "Promise.all([p1, p2]) waits for all to fulfill and returns an array of results. If any rejects, the whole thing rejects—use Promise.allSettled when you need every outcome.",
      example: `const [users, posts] = await Promise.all([
  fetch("/api/users").then((r) => r.json()),
  fetch("/api/posts").then((r) => r.json()),
]);`,
      prerequisites: ["await"],
      quizQuestion: "What happens if one Promise in Promise.all rejects?",
      quizOptions: [
        "Others are ignored; whole rejects",
        "Only that one fails silently",
        "JavaScript restarts",
        "Nothing",
      ],
      correctAnswer: 0,
      unlocks: [],
      position: { x: 620, y: 660 },
      explainVariants: {
        simple: "Promise.all runs tasks together—one failure fails the batch.",
        mongolian: "Promise.all бүгдийг зэрэг хүлээнэ; нэг reject бол бүтнээр reject.",
      },
    },
    {
      id: "real-api-request",
      title: "Real API Request",
      level: 6,
      status: "locked",
      summary: "Combine fetch, async/await, and error handling in practice.",
      explanation:
        "Production API calls need base URLs, headers, auth tokens, loading states, and error UI. AbortController can cancel in-flight requests when users navigate away.",
      example: `async function fetchAtlas(topic) {
  const controller = new AbortController();
  const res = await fetch(\`/api/atlas?q=\${topic}\`, {
    signal: controller.signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to load atlas");
  return res.json();
}`,
      prerequisites: ["fetch-api"],
      quizQuestion: "What helps cancel an in-flight fetch?",
      quizOptions: [
        "AbortController",
        "localStorage.clear",
        "document.cookie",
        "CSS animations",
      ],
      correctAnswer: 0,
      unlocks: ["mastery-project"],
      position: { x: 40, y: 660 },
      explainVariants: {
        simple: "Real apps wire fetch + loading + errors + optional cancel via AbortController.",
        mongolian: "Бодит API дуудлагад loading, алдаа, AbortController хэрэгтэй.",
      },
    },
    {
      id: "mastery-project",
      title: "Mastery Project",
      level: 7,
      status: "locked",
      summary: "Build a mini async dashboard end-to-end.",
      explanation:
        "Capstone: load multiple resources with Promise.all, show loading skeletons, handle errors, and retry. This mirrors how TaliinAtlas would fetch and render a live knowledge graph.",
      example: `// Capstone sketch
async function buildDashboard() {
  setLoading(true);
  try {
    const data = await Promise.all([
      fetchConcepts(),
      fetchProgress(),
    ]);
    renderMap(data);
  } finally {
    setLoading(false);
  }
}`,
      prerequisites: ["real-api-request", "promise-all", "error-handling"],
      quizQuestion: "What pattern fits loading several API resources at once?",
      quizOptions: [
        "Nested setTimeout only",
        "Promise.all with async/await",
        "Synchronous while(true)",
        "Inline CSS",
      ],
      correctAnswer: 1,
      unlocks: [],
      position: { x: 280, y: 800 },
      isMastery: true,
      explainVariants: {
        simple: "Your capstone ties every async tool into one polished user flow.",
        eli12: "Like finishing a video game level—you use everything you learned together.",
        mongolian: "Эцсийн төсөл: Promise.all, fetch, async/await, алдааг нэгтгэнэ.",
      },
    },
  ],
  edges: [
    { id: "e1", source: "js-basics", target: "callbacks" },
    { id: "e2", source: "callbacks", target: "promises" },
    { id: "e3", source: "promises", target: "fetch-api" },
    { id: "e4", source: "promises", target: "async-functions" },
    { id: "e5", source: "fetch-api", target: "real-api-request" },
    { id: "e6", source: "async-functions", target: "await" },
    { id: "e7", source: "async-functions", target: "error-handling" },
    { id: "e8", source: "await", target: "promise-all" },
    { id: "e9", source: "real-api-request", target: "mastery-project" },
    { id: "e10", source: "promise-all", target: "mastery-project" },
    { id: "e11", source: "error-handling", target: "mastery-project" },
  ],
};

export const exampleTopics = [
  "Learn JavaScript Async",
  "React Hooks",
  "Git and GitHub",
  "Database Basics",
];
