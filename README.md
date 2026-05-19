# TaliinAtlas

AI-powered visual learning platform that turns any topic into an explorable interactive knowledge map.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Flow
- Framer Motion
- localStorage (progress, demo auth, saved atlases)

## Getting started

```bash
npm install
npm run train:ml
npm run dev
```

On Windows PowerShell, if `npm` is blocked by execution policy, use:

```powershell
npm.cmd install
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000).

# TaliinAtlas Custom ML Engine

**No paid AI API required.** TaliinAtlas ships a local **custom ML/NLP pipeline** written in TypeScript:

- Curated training dataset (`140` examples, `10` categories)
- Tokenizer + stopwords + light stemming + bigrams
- TF-IDF feature extraction
- **Naive Bayes** log-likelihood classifier
- **Nearest centroid** cosine classifier
- **Ensemble** score fusion + confidence normalization
- Category template selection → graph planner → lesson/quiz generators
- **Zod** schema validation + normalizer
- Model artifact: `src/generated/ml/taliin-atlas-model.json`
- Evaluation report: `src/generated/ml/evaluation-report.json`

### Why not just use an AI API?

This MVP is intentionally **no-budget** and **portfolio-focused**. Instead of wrapping a paid LLM API, TaliinAtlas demonstrates **custom AI product architecture** using local ML/NLP components you can explain in interviews.

### AI Demo Flow

1. Enter **"Learn React Hooks"**
2. Classifier detects **react** (ensemble)
3. Atlas generator selects the React template
4. Graph planner builds nodes, edges, positions
5. Quiz generator creates unlock quizzes
6. Zod validates the atlas
7. React Flow renders your learning world

### API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/ai/generate-atlas` | POST | Full atlas generation |
| `/api/ai/classify` | POST | Classification only |
| `/api/ai/model-info` | GET | Model metadata + accuracy |
| `/api/ai/explain-node` | POST | Local explanation modes |

Open **AI Lab** at [/lab](http://localhost:3000/lab) to inspect classification, tokens, and signals.

## Features

### Learning map (MVP)

- Hero landing with topic input, learning modes, and example chips
- **Custom ML-generated atlases** per topic (React, Git, SQL, async JS, …)
- Interactive React Flow knowledge map with custom nodes
- Fog of Knowledge visual effect
- Lesson panel with quizzes and static AI explanation modes
- Quiz unlock system
- Progress panel and JSON export

### Personal vault (demo auth + saves)

- Local demo login / register (no server, no paid services)
- **Continue as Demo Learner** one-click profile
- Save atlases to **My Learning Worlds** (`/library`)
- Per-atlas progress persistence
- Search, sort, favorites, rename, duplicate, delete
- Unsaved atlas badge and leave warning

## Demo Auth Notice

**This MVP uses localStorage-based demo authentication.**

- Accounts and passwords are stored **only in your browser** on this device.
- Passwords are stored in plain text for demo simplicity — **not production authentication**.
- No data is sent to any server.
- Clearing browser storage removes accounts and saved atlases.
- The `authService` and `savedAtlasStorage` layers are designed so you can later swap implementations for **Supabase**, **Firebase**, or a **custom Laravel API** without rewriting UI components.

## Project structure

```
src/
  app/api/ai/       # generate-atlas, classify, model-info, explain-node
  app/lab/          # AI Lab diagnostics panel
  components/ai/    # AIEngineBadge, classification UI
  components/lab/   # AILabPanel
  data/ml/          # training examples, category definitions
  generated/ml/     # trained model JSON + evaluation report
  lib/ml/           # tokenizer, classifiers, training, inference
  lib/ai/           # templates, graph planner, generators, schema
scripts/            # train-ml-model.ts, evaluate-ml-model.ts
```

## How to test login & save flow

1. Run the app and click **Generate Atlas**.
2. Click **Log in** (navbar) or **Save this Atlas** → auth modal opens.
3. Click **Continue as Demo Learner** or register a local account.
4. Click **Save this Atlas** — atlas is stored in My Atlases.
5. Complete a quiz — progress auto-saves on the stored record.
6. Open **My Atlases** → **Continue Learning** — map and progress restore.
7. **Log out** — you can still generate/explore; saving prompts login again.

## localStorage keys

| Key | Purpose |
|-----|---------|
| `taliin_atlas_users` | Demo user accounts |
| `taliin_atlas_session` | Current session |
| `taliin_atlas_saved_atlases` | Saved learning worlds |
| `taliin-atlas-progress:{id}` | Guest/temporary progress per template atlas |

## Future backend upgrade path

Replace implementations behind:

- `authService.login()` / `register()` / `logout()`
- `savedAtlasStorage.getAtlasesByUser()` / `saveAtlas()` / `updateSavedAtlasFromWorkspace()`

Keep React components consuming `useAuth()` and `useAtlasWorkspace()` unchanged.
