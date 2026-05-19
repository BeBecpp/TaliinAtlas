import { z } from "zod";

const nodeStatusSchema = z.enum(["locked", "available", "completed"]);

export const atlasNodeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  level: z.number().int().positive(),
  status: nodeStatusSchema,
  summary: z.string().min(1),
  explanation: z.string().min(1),
  example: z.string().min(1),
  prerequisites: z.array(z.string()),
  quizQuestion: z.string().min(1),
  quizOptions: z.array(z.string()).length(4),
  correctAnswer: z.number().int().min(0).max(3),
  unlocks: z.array(z.string()),
  position: z.object({ x: z.number(), y: z.number() }),
  isMastery: z.boolean().optional(),
  explainVariants: z
    .object({
      simple: z.string().optional(),
      example: z.string().optional(),
      eli12: z.string().optional(),
      mongolian: z.string().optional(),
    })
    .optional(),
});

export const atlasEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
});

export const atlasDataSchema = z
  .object({
    id: z.string().min(1),
    topic: z.string().min(1),
    description: z.string().min(1),
    nodes: z.array(atlasNodeSchema).min(5).max(12),
    edges: z.array(atlasEdgeSchema),
    recommendedPath: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    const ids = new Set(data.nodes.map((n) => n.id));
    if (ids.size !== data.nodes.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Duplicate node ids" });
    }
    for (const node of data.nodes) {
      if (node.correctAnswer >= node.quizOptions.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid correctAnswer on ${node.id}`,
        });
      }
    }
    if (data.nodes[0]?.status !== "available") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "First node must be available" });
    }
  });

export type ValidatedAtlas = z.infer<typeof atlasDataSchema>;
