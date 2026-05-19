import fs from "fs";
import path from "path";
import type { TaliinAtlasModelArtifact } from "./types";
import { trainFullModel } from "./modelTrainer";

const MODEL_PATH = path.join(
  process.cwd(),
  "src",
  "generated",
  "ml",
  "taliin-atlas-model.json"
);

let cachedModel: TaliinAtlasModelArtifact | null = null;

export function getModelPath(): string {
  return MODEL_PATH;
}

export function loadModelFromDisk(): TaliinAtlasModelArtifact | null {
  try {
    if (!fs.existsSync(MODEL_PATH)) return null;
    const raw = fs.readFileSync(MODEL_PATH, "utf-8");
    return JSON.parse(raw) as TaliinAtlasModelArtifact;
  } catch {
    return null;
  }
}

export function saveModelToDisk(model: TaliinAtlasModelArtifact): void {
  const dir = path.dirname(MODEL_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(MODEL_PATH, JSON.stringify(model, null, 2), "utf-8");
}

/** Load artifact from disk or train in-memory fallback. */
export function getModel(): TaliinAtlasModelArtifact {
  if (cachedModel) return cachedModel;
  const fromDisk = loadModelFromDisk();
  if (fromDisk) {
    cachedModel = fromDisk;
    return fromDisk;
  }
  cachedModel = trainFullModel();
  return cachedModel;
}

export function refreshModelCache(): void {
  cachedModel = null;
}
