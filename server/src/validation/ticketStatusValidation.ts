import { z } from "zod";

export const updateTicketStatusSchema = z.object({
  status: z.enum([
    "OPEN",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
  ]),
}).strict();

export type UpdateTicketStatusInput = z.infer<
  typeof updateTicketStatusSchema
>;
