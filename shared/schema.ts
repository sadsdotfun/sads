import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const predictionRequestSchema = z.object({
  address: z.string().min(32).max(44),
});

export const riskWindowSchema = z.object({
  timeHours: z.number(),
  confidence: z.number(),
  description: z.string(),
});

export const similarCaseSchema = z.object({
  confidence: z.number(),
  outcome: z.string(),
  timeframe: z.string(),
});

export const predictionResponseSchema = z.object({
  address: z.string(),
  TFI: z.number(),
  QSS: z.number(),
  liquiditySafety: z.number(),
  holderSymmetry: z.number(),
  anomalyCount: z.number(),
  riskWindows: z.array(riskWindowSchema),
  similarPastCases: z.array(similarCaseSchema),
});

export type PredictionRequest = z.infer<typeof predictionRequestSchema>;
export type RiskWindow = z.infer<typeof riskWindowSchema>;
export type SimilarCase = z.infer<typeof similarCaseSchema>;
export type PredictionResponse = z.infer<typeof predictionResponseSchema>;
