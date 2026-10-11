
import { Router } from "express";
import { ZodError } from "zod";
import { authenticateToken } from "../middleware/authMiddleware";
import { createNewTicket, TicketError } from "../services/ticketService";
import { createTicketSchema } from "../validation/ticketValidation";
import type { AuthenticatedRequest } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
        const input = createTicketSchema.parse(authReq.body);

if (!authReq.auth) {
  res.status(401).json({
    message: "Authentication required",
  });
  return;
}

const ticket = await createNewTicket(
  input,
  authReq.auth.userId,
);
    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Invalid ticket data",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    if (error instanceof TicketError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return;
    }

    console.error("Ticket creation failed:", error);
    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
});

export default router;
