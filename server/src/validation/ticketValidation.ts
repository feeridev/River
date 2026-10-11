
import { z } from "zod";

export const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(120, "Title cannot exceed 120 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description cannot exceed 5000 characters"),

  category: z.enum([
    "HARDWARE",
    "SOFTWARE",
    "NETWORK",
    "ACCOUNT",
    "ACCESS",
    "OTHER",
  ]),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .optional(),
});
