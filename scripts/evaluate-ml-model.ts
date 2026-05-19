import fs from "fs";
import path from "path";
import { getModel, getModelPath } from "../src/lib/ml/modelLoader";
import { evaluateModel } from "../src/lib/ml/modelEvaluator";

const REPORT_PATH = path.join(
  process.cwd(),
  "src",
  "generated",
  "ml",
  "evaluation-report.json"
);

function main() {
  const model = getModel();
  const evaluation = evaluateModel(model);
  console.log("Model:", getModelPath());
  console.log("Accuracy:", (evaluation.accuracy * 100).toFixed(1) + "%");
  console.log("Top-2:", (evaluation.top2Accuracy * 100).toFixed(1) + "%");
  console.log("\nPer-category recall:");
  for (const [cat, m] of Object.entries(evaluation.categoryMetrics)) {
    console.log(`  ${cat}: ${(m.recall * 100).toFixed(0)}% (${m.correct}/${m.support})`);
  }

  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), evaluation }, null, 2),
    "utf-8"
  );
}

main();
