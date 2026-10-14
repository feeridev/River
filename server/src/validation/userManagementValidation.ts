import { z } from "zod";

export const updateManagedRoleSchema = z.object({
  role: z.enum(["EMPLOYEE", "AGENT"]),
});

export const updateManagedStatusSchema = z.object({
  isActive: z.boolean(),
});
