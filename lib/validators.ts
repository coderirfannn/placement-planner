import { z } from "zod";

export const OnboardingSchema = z.object({
  segment: z.enum(["A", "B", "C"]),
  timeMinutes: z.union([z.literal(60), z.literal(120), z.literal(180)]),
  track: z.enum(["sde", "web", "java"]),
});

export const TaskUpdateSchema = z.object({
  dateKey: z.string().min(10).max(10), // "YYYY-MM-DD"
  taskKey: z.string().min(3),
  status: z.enum(["done", "skipped"]),
});
