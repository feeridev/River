
import { Router } from "express";
import { ZodError } from "zod";

import {
  authenticateToken,
  type AuthenticatedRequest,
} from "../middleware/authMiddleware";

import {
  createNewTicket,
  getTicketForUser,
  getTicketsForUser,
  updateTicketForUser,
  TicketError,
} from "../services/ticketService";

import {
  createTicketSchema,
  updateTicketSchema,
} from "../validation/ticketValidation";

const router = Router();
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.auth) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const ticket = await getTicketForUser(
      authReq.params.id as string,
      authReq.auth.userId,
    );

    res.status(200).json({ ticket });
  } catch (error) {
    if (error instanceof TicketError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return;
    }

    console.error("Fetching ticket failed:", error);

    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
});
// GET /api/tickets
// Employees can see only tickets they created.
router.get("/", authenticateToken, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.auth) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const tickets = await getTicketsForUser(
      authReq.auth.userId,
    );

    res.status(200).json({
      tickets,
      count: tickets.length,
    });
  } catch (error) {
    if (error instanceof TicketError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return;
    }

    console.error("Ticket listing failed:", error);

    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
});

router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.auth) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const input = updateTicketSchema.parse(authReq.body);

    const ticket = await updateTicketForUser(
      authReq.params.id as string,
      authReq.auth.userId,
      input,
    );

    res.status(200).json({
      message: "Ticket updated successfully",
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

    console.error("Ticket update failed:", error);

    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
});

// POST /api/tickets
// Create a ticket for the authenticated employee.
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
