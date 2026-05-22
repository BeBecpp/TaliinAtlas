<div align="center">

# TaliinAtlas

### Turn confusion into a map

TaliinAtlas is an AI-powered learning map platform that turns confusing topics, notes, and learning goals into interactive visual knowledge maps.

Instead of giving users another long explanation, it helps them understand:

**what to learn first, what depends on what, and how their progress grows.**

<br/>

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/React_Flow-FF0072?style=for-the-badge" />
<img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge" />

</div>

---

## What It Does

TaliinAtlas helps learners turn messy information into a structured learning path.

A user can enter a topic, goal, or confusing subject.  
The app then creates a visual map of concepts, dependencies, lessons, examples, quizzes, and progress.

The goal is to make learning feel less overwhelming and more visual.

---

## Why I Built It

Many students do not struggle because they lack information.

They struggle because information is:

- unstructured
- overwhelming
- hard to prioritize
- disconnected from progress
- difficult to turn into a clear learning plan

I built TaliinAtlas because I wanted to create a learning tool that helps students see the structure behind a topic.

Instead of asking, “What should I study next?”, the user can see a map and follow a clear path.

---

## Core Idea

| Problem | TaliinAtlas Solution |
|---|---|
| I do not know where to start | Shows the first concepts to learn |
| I do not know what depends on what | Builds a dependency-based learning map |
| I feel overwhelmed | Breaks a topic into smaller nodes |
| I want to track progress | Uses unlock/progress states |
| Normal notes feel boring | Turns learning into an interactive visual system |

---

## Features

| Feature | Description |
|---|---|
| Visual learning map | Displays topics as connected nodes |
| Concept dependency graph | Shows how ideas connect to each other |
| Learning path | Helps users know what to learn first |
| Node detail panels | Provides lessons, examples, and quiz-style content |
| Progress system | Tracks completed and unlocked concepts |
| Fog of knowledge | Represents unknown or locked concepts visually |
| Local save | Stores learning maps locally |
| AI-style generation | Converts messy input into structured learning maps |
| Smooth UI | Uses animation and clean visual layout |

---

## Screenshots

<div align="center">

<!-- Replace these with real screenshots after adding images -->

<img src="./public/screenshots/taliinatlas-home.png" alt="TaliinAtlas Home" width="100%" />

<br/><br/>

<img src="./public/screenshots/taliinatlas-map.png" alt="TaliinAtlas Learning Map" width="100%" />

</div>

> If the screenshots do not exist yet, create `public/screenshots/` and add your images there.

---

## How It Works

1. The user enters a topic, note, or learning goal.
2. TaliinAtlas analyzes the topic and breaks it into smaller concepts.
3. Concepts are turned into nodes.
4. Dependencies are created between nodes.
5. The user explores the visual learning map.
6. Each node can include lesson content, examples, or quiz-style tasks.
7. Progress is saved locally as the user learns.

---

## Tech Stack

| Area | Tools |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Graph UI | React Flow |
| Animation | Framer Motion |
| Validation | Zod |
| State / Storage | Local state, localStorage |
| Product Type | AI-ready education platform |

---

## Quick Start

```bash
npm install
npm run dev
