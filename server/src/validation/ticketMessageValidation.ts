import { z } from "zod";

export const createTicketMessageSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(5000, "Message cannot exceed 5000 characters"),
}).strict();

export type CreateTicketMessageInput = z.infer<
  typeof createTicketMessageSchema
>;
