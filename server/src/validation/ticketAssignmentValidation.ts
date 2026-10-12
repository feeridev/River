import { z } from "zod";

export const assignTicketSchema = z.object({
  assignedTo: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid agent ID"),
}).strict();

export type AssignTicketInput = z.infer<
  typeof assignTicketSchema
>;
