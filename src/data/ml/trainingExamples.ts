import type { TrainingExample, TopicCategory } from "@/lib/ml/types";

function ex(
  id: string,
  input: string,
  category: TopicCategory,
  tags: string[],
  difficultyHint?: TrainingExample["difficultyHint"]
): TrainingExample {
  return { id, input, category, tags, difficultyHint };
}

const reactExamples: TrainingExample[] = [
  ex("r1", "Learn React Hooks", "react", ["react", "hooks"]),
  ex("r2", "I want to understand useState and useEffect", "react", ["usestate", "useeffect"]),
  ex("r3", "How do props and state work in React?", "react", ["props", "state"]),
  ex("r4", "Build components with JSX", "react", ["jsx", "components"]),
  ex("r5", "React component lifecycle beginner guide", "react", ["lifecycle", "beginner"]),
  ex("r6", "teach me react context and custom hooks", "react", ["context", "hooks"], "intermediate"),
  ex("r7", "How to pass data between React components", "react", ["props", "data"]),
  ex("r8", "React useEffect dependency array explained", "react", ["useeffect", "dependency"]),
  ex("r9", "I need a react tutorial for beginners", "react", ["tutorial", "beginner"]),
  ex("r10", "understanding controlled inputs in react forms", "react", ["forms", "controlled"]),
  ex("r11", "react redux state management intro", "react", ["redux", "state"], "intermediate"),
  ex("r12", "How does virtual DOM work in React?", "react", ["virtualdom", "react"]),
  ex("r13", "learn react with vite and typescript", "react", ["vite", "typescript"], "intermediate"),
  ex("r14", "react event handling onClick onChange", "react", ["events", "handlers"]),
];

const jsAsyncExamples: TrainingExample[] = [
  ex("ja1", "Learn async await", "javascript-async", ["async", "await"]),
  ex("ja2", "I don't understand promises", "javascript-async", ["promises"]),
  ex("ja3", "How does fetch API work?", "javascript-async", ["fetch", "api"]),
  ex("ja4", "Callbacks promises async await", "javascript-async", ["callbacks", "promises", "async"]),
  ex("ja5", "JavaScript asynchronous programming", "javascript-async", ["async", "javascript"]),
  ex("ja6", "promise.all and error handling async", "javascript-async", ["promiseall", "errors"], "intermediate"),
  ex("ja7", "what is the event loop in javascript", "javascript-async", ["eventloop"]),
  ex("ja8", "how to chain .then() in promises", "javascript-async", ["then", "chain"]),
  ex("ja9", "async functions return type promise", "javascript-async", ["async", "functions"]),
  ex("ja10", "fetch json data from rest api javascript", "javascript-async", ["fetch", "rest"]),
  ex("ja11", "callback hell vs promises beginner", "javascript-async", ["callback", "hell"]),
  ex("ja12", "learn javascript async for api calls", "javascript-async", ["api", "async"]),
  ex("ja13", "try catch with await in node", "javascript-async", ["trycatch", "node"], "intermediate"),
  ex("ja14", "non blocking io javascript explained", "javascript-async", ["nonblocking"]),
];

const gitExamples: TrainingExample[] = [
  ex("g1", "Learn Git and GitHub", "git", ["git", "github"]),
  ex("g2", "Understand commits branches and pull requests", "git", ["commit", "branch", "pr"]),
  ex("g3", "How to resolve merge conflicts", "git", ["merge", "conflict"]),
  ex("g4", "Git workflow for teams", "git", ["workflow", "teams"]),
  ex("g5", "Push pull branch merge", "git", ["push", "pull", "merge"]),
  ex("g6", "git rebase vs merge beginner", "git", ["rebase", "merge"]),
  ex("g7", "how to clone a repository from github", "git", ["clone", "github"]),
  ex("g8", "create feature branch and open pull request", "git", ["feature", "pr"]),
  ex("g9", "git stash and undo last commit", "git", ["stash", "undo"], "intermediate"),
  ex("g10", "github actions ci basics", "git", ["actions", "ci"], "intermediate"),
  ex("g11", "learn version control with git", "git", ["version", "control"]),
  ex("g12", "git cherry pick and squash commits", "git", ["cherrypick", "squash"], "advanced"),
  ex("g13", "how to write good commit messages", "git", ["commit", "messages"]),
  ex("g14", "fork repo and contribute open source", "git", ["fork", "opensource"]),
];

const databaseExamples: TrainingExample[] = [
  ex("db1", "Learn SQL basics", "database", ["sql", "basics"]),
  ex("db2", "Understand tables rows columns primary keys", "database", ["table", "keys"]),
  ex("db3", "Database relationships and joins", "database", ["joins", "relations"]),
  ex("db4", "SELECT WHERE JOIN beginner", "database", ["select", "where", "join"]),
  ex("db5", "How relational databases work", "database", ["relational"]),
  ex("db6", "postgres vs mysql for beginners", "database", ["postgres", "mysql"]),
  ex("db7", "normalize database schema 3nf", "database", ["normalize", "schema"], "intermediate"),
  ex("db8", "sql indexes and query performance", "database", ["index", "performance"], "intermediate"),
  ex("db9", "foreign key one to many relationship", "database", ["foreignkey", "relationship"]),
  ex("db10", "write sql queries with group by", "database", ["groupby", "aggregate"]),
  ex("db11", "database transactions acid properties", "database", ["transactions", "acid"], "advanced"),
  ex("db12", "learn nosql vs sql differences", "database", ["nosql", "sql"]),
  ex("db13", "design er diagram for app database", "database", ["er", "design"]),
  ex("db14", "sql injection prevention basics", "database", ["security", "injection"]),
];

const programmingBasicsExamples: TrainingExample[] = [
  ex("pb1", "What is programming for absolute beginners", "programming-basics", ["beginner"]),
  ex("pb2", "Learn variables and data types", "programming-basics", ["variables", "types"]),
  ex("pb3", "if else conditions tutorial", "programming-basics", ["conditions"]),
  ex("pb4", "for loop while loop explained", "programming-basics", ["loops"]),
  ex("pb5", "how to write functions in code", "programming-basics", ["functions"]),
  ex("pb6", "arrays and lists beginner programming", "programming-basics", ["arrays"]),
  ex("pb7", "objects and dictionaries intro", "programming-basics", ["objects"]),
  ex("pb8", "debugging code step by step", "programming-basics", ["debugging"]),
  ex("pb9", "my first hello world program", "programming-basics", ["hello", "world"]),
  ex("pb10", "learn coding from scratch no experience", "programming-basics", ["scratch"]),
  ex("pb11", "boolean logic and comparisons", "programming-basics", ["boolean"]),
  ex("pb12", "read input and print output basics", "programming-basics", ["io"]),
  ex("pb13", "how to think like a programmer", "programming-basics", ["thinking"]),
  ex("pb14", "fix syntax errors beginner guide", "programming-basics", ["syntax", "errors"]),
];

const webDevExamples: TrainingExample[] = [
  ex("wd1", "Learn HTML CSS and JavaScript", "web-development", ["html", "css", "javascript"]),
  ex("wd2", "Build my first website from scratch", "web-development", ["website"]),
  ex("wd3", "DOM manipulation tutorial", "web-development", ["dom"]),
  ex("wd4", "responsive design with flexbox", "web-development", ["flexbox", "responsive"]),
  ex("wd5", "how http requests work in browsers", "web-development", ["http"]),
  ex("wd6", "html forms and validation basics", "web-development", ["forms"]),
  ex("wd7", "css grid layout beginner", "web-development", ["grid", "css"]),
  ex("wd8", "deploy static site to netlify", "web-development", ["deploy"]),
  ex("wd9", "frontend vs backend explained", "web-development", ["frontend", "backend"]),
  ex("wd10", "rest api consumption from frontend", "web-development", ["rest", "api"]),
  ex("wd11", "accessibility basics for web apps", "web-development", ["a11y"], "intermediate"),
  ex("wd12", "learn tailwind css utility classes", "web-development", ["tailwind"]),
  ex("wd13", "single page app routing concepts", "web-development", ["spa", "routing"]),
  ex("wd14", "web performance lighthouse tips", "web-development", ["performance"], "intermediate"),
];

const algorithmsExamples: TrainingExample[] = [
  ex("al1", "Learn sorting algorithms", "algorithms", ["sorting"]),
  ex("al2", "Understand binary search", "algorithms", ["binary", "search"]),
  ex("al3", "Big O notation beginner", "algorithms", ["bigo"]),
  ex("al4", "Data structures and algorithms course", "algorithms", ["datastructures"]),
  ex("al5", "Arrays stacks queues trees", "algorithms", ["arrays", "trees"]),
  ex("al6", "bubble sort vs quick sort", "algorithms", ["sort"]),
  ex("al7", "recursion explained with examples", "algorithms", ["recursion"]),
  ex("al8", "graph bfs dfs introduction", "algorithms", ["graph", "bfs"], "intermediate"),
  ex("al9", "dynamic programming beginner", "algorithms", ["dp"], "advanced"),
  ex("al10", "hash map dictionary use cases", "algorithms", ["hashmap"]),
  ex("al11", "two pointer technique arrays", "algorithms", ["twopointer"], "intermediate"),
  ex("al12", "leetcode prep roadmap", "algorithms", ["leetcode"]),
  ex("al13", "time complexity of nested loops", "algorithms", ["complexity"]),
  ex("al14", "sliding window algorithm pattern", "algorithms", ["slidingwindow"], "intermediate"),
];

const systemDesignExamples: TrainingExample[] = [
  ex("sd1", "Learn system design basics", "system-design-basics", ["system", "design"]),
  ex("sd2", "What is caching and load balancing", "system-design-basics", ["cache", "loadbalancer"]),
  ex("sd3", "How scalable web apps work", "system-design-basics", ["scalable"]),
  ex("sd4", "APIs databases queues architecture", "system-design-basics", ["api", "queue"]),
  ex("sd5", "Backend architecture beginner", "system-design-basics", ["backend"]),
  ex("sd6", "microservices vs monolith intro", "system-design-basics", ["microservices"]),
  ex("sd7", "redis caching patterns", "system-design-basics", ["redis", "cache"], "intermediate"),
  ex("sd8", "message queue kafka rabbitmq basics", "system-design-basics", ["kafka", "queue"], "intermediate"),
  ex("sd9", "horizontal vs vertical scaling", "system-design-basics", ["scaling"]),
  ex("sd10", "rate limiting and api gateway", "system-design-basics", ["ratelimit"], "intermediate"),
  ex("sd11", "database sharding replication overview", "system-design-basics", ["sharding"], "advanced"),
  ex("sd12", "monitoring logging observability 101", "system-design-basics", ["monitoring"]),
  ex("sd13", "design url shortener system", "system-design-basics", ["urlshortener"], "intermediate"),
  ex("sd14", "cap theorem explained simply", "system-design-basics", ["cap"], "intermediate"),
];

const studyGenericExamples: TrainingExample[] = [
  ex("sg1", "I have messy notes and want to study them", "study-generic", ["notes", "study"]),
  ex("sg2", "Help me prepare for an exam", "study-generic", ["exam", "prepare"]),
  ex("sg3", "Turn these notes into a learning path", "study-generic", ["notes", "path"]),
  ex("sg4", "I don't know where to start learning", "study-generic", ["start"]),
  ex("sg5", "Create a study plan for this week", "study-generic", ["plan"]),
  ex("sg6", "summarize my lecture notes into concepts", "study-generic", ["summarize"]),
  ex("sg7", "help me review before midterm test", "study-generic", ["review", "test"]),
  ex("sg8", "organize topics i need to learn", "study-generic", ["organize"]),
  ex("sg9", "learning roadmap from beginner to advanced", "study-generic", ["roadmap"]),
  ex("sg10", "i want to understand this subject faster", "study-generic", ["faster"]),
  ex("sg11", "break down complex topic into steps", "study-generic", ["breakdown"]),
  ex("sg12", "study schedule for working professionals", "study-generic", ["schedule"]),
  ex("sg13", "flashcard style review my material", "study-generic", ["flashcard"]),
  ex("sg14", "motivation and focus while studying", "study-generic", ["focus"]),
];

const mathBasicsExamples: TrainingExample[] = [
  ex("mb1", "Learn algebra basics", "math-basics", ["algebra"]),
  ex("mb2", "Solve linear equations step by step", "math-basics", ["equations"]),
  ex("mb3", "Understand ratios and percentages", "math-basics", ["ratio", "percent"]),
  ex("mb4", "Graph linear functions", "math-basics", ["graph", "functions"]),
  ex("mb5", "fractions decimals and percentages", "math-basics", ["fractions"]),
  ex("mb6", "word problems math beginner", "math-basics", ["wordproblems"]),
  ex("mb7", "geometry angles and shapes intro", "math-basics", ["geometry"]),
  ex("mb8", "probability basics for students", "math-basics", ["probability"]),
  ex("mb9", "quadratic equations factoring", "math-basics", ["quadratic"], "intermediate"),
  ex("mb10", "statistics mean median mode", "math-basics", ["statistics"]),
  ex("mb11", "trigonometry sin cos tan intro", "math-basics", ["trig"], "intermediate"),
  ex("mb12", "calculus derivatives beginner", "math-basics", ["calculus"], "advanced"),
  ex("mb13", "math exam prep practice problems", "math-basics", ["exam"]),
  ex("mb14", "understand variables in math equations", "math-basics", ["variables"]),
];

/** Curated training corpus (140 examples). */
export const TRAINING_EXAMPLES: TrainingExample[] = [
  ...reactExamples,
  ...jsAsyncExamples,
  ...gitExamples,
  ...databaseExamples,
  ...programmingBasicsExamples,
  ...webDevExamples,
  ...algorithmsExamples,
  ...systemDesignExamples,
  ...studyGenericExamples,
  ...mathBasicsExamples,
];
