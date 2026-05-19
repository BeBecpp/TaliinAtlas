import "server-only";
import { classifyInput, getModelInfoFromArtifact } from "./inference";
import { getModel } from "./modelLoader";

export function classifyOnServer(input: string) {
  return classifyInput(input, getModel());
}

export function getServerModelInfo() {
  return getModelInfoFromArtifact(getModel());
}
