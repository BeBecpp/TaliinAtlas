import fs from "fs";
import path from "path";
import { trainFullModel } from "../src/lib/ml/modelTrainer";
import { saveModelToDisk, getModelPath } from "../src/lib/ml/modelLoader";

const REPORT_PATH = path.join(
  process.cwd(),
  "src",
  "generated",
  "ml",
  "evaluation-report.json"
);

function main() {
  console.log("Training TaliinAtlas Custom ML Engine...");
  const model = trainFullModel();

  saveModelToDisk(model);

  const reportDir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        modelVersion: model.version,
        trainingExampleCount: model.trainingExampleCount,
        vocabularySize: model.vocabularySize,
        evaluation: model.evaluation,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log("\n✓ Model saved:", getModelPath());
  console.log("✓ Report saved:", REPORT_PATH);
  console.log("\nSummary:");
  console.log("  Training examples:", model.trainingExampleCount);
  console.log("  Vocabulary size:", model.vocabularySize);
  console.log("  Accuracy:", (model.evaluation.accuracy * 100).toFixed(1) + "%");
  console.log("  Top-2 accuracy:", (model.evaluation.top2Accuracy * 100).toFixed(1) + "%");
}

main();
