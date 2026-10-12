
import { Router } from "express";
import { ZodError } from "zod";

import { requireRole } from "../middleware/roleMiddleware";
import {
  authenticateToken,
  type AuthenticatedRequest,
} from "../middleware/authMiddleware";

import {
  assignTicketForAdmin,
  createNewTicket,
  getTicketForUser,
  getTicketsForUser,
  updateTicketForUser,
  TicketError,
} from "../services/ticketService";

import {
  sendTicketMessage,
  getTicketMessages,
  TicketMessageError,
} from "../services/ticketMessageService";

import { assignTicketSchema } from "../validation/ticketAssignmentValidation";
import { createTicketMessageSchema } from "../validation/ticketMessageValidation";
import {
  createTicketSchema,
  updateTicketSchema,
} from "../validation/ticketValidation";

const router = Router();

// GET /api/tickets/:id
// Employees: own tickets. Agents: own and assigned tickets. Admins: all tickets.
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.auth) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const ticket = await getTicketForUser(
      authReq.params.id as string,
      authReq.auth.userId,
      authReq.auth.role,
    );

    res.status(200).json({ ticket });
  } catch (error) {
    if (error instanceof TicketError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Fetching ticket failed:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// GET /api/tickets
// Returns tickets accessible to the authenticated user.
router.get("/", authenticateToken, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.auth) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const tickets = await getTicketsForUser(
      authReq.auth.userId,
      authReq.auth.role,
    );

    res.status(200).json({
      tickets,
      count: tickets.length,
    });
  } catch (error) {
    if (error instanceof TicketError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Ticket listing failed:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// PATCH /api/tickets/:id
// Updates a ticket according to the service's existing edit permissions.
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.auth) {
      res.status(401).json({ message: "Authentication required" });
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
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Ticket update failed:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// POST /api/tickets
// Creates a ticket for the authenticated user.
router.post("/", authenticateToken, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.auth) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const input = createTicketSchema.parse(authReq.body);

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
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Ticket creation failed:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// GET /api/tickets/:id/messages
// Reads conversation messages if the user can access the ticket.
router.get("/:id/messages", authenticateToken, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.auth) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const messages = await getTicketMessages(
      authReq.params.id as string,
      authReq.auth.userId,
      authReq.auth.role,
    );

    res.status(200).json({
      messages,
      count: messages.length,
    });
  } catch (error) {
    if (error instanceof TicketMessageError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Fetching ticket messages failed:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// POST /api/tickets/:id/messages
// Replies to a ticket if the user can access it.
router.post("/:id/messages", authenticateToken, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.auth) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const input = createTicketMessageSchema.parse(authReq.body);

    const message = await sendTicketMessage(
      authReq.params.id as string,
      authReq.auth.userId,
      authReq.auth.role,
      input.body,
    );

    res.status(201).json({
      message: "Reply sent successfully",
      ticketMessage: message,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Invalid message data",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    if (error instanceof TicketMessageError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Sending ticket message failed:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// PATCH /api/tickets/:id/assignment
// Admins can assign tickets to active agents.
router.patch(
  "/:id/assignment",
  authenticateToken,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      const input = assignTicketSchema.parse(req.body);

      const assignment = await assignTicketForAdmin(
        req.params.id as string,
        input.assignedTo,
      );

      res.status(200).json({
        message: "Ticket assigned successfully",
        assignment,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Invalid assignment data",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
        return;
      }

      if (error instanceof TicketError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      console.error("Ticket assignment failed:", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  },
);

export default router;
