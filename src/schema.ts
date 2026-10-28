import { z } from "zod";

export const recordSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  published: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  summary: z.string().min(1),
  source_url: z.string().min(1),
});

export type RecordRow = z.infer<typeof recordSchema>;
