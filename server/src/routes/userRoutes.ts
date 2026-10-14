import { Router } from "express";
import { ZodError } from "zod";
import {
  authenticateToken,
  type AuthenticatedRequest,
} from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import {
  changeManagedUserActiveStatus,
  changeManagedUserRole,
  getUsersForAdmin,
  UserManagementError,
} from "../services/userManagementService";
import {
  updateManagedRoleSchema,
  updateManagedStatusSchema,
} from "../validation/userManagementValidation";

const router = Router();

router.use(authenticateToken, requireRole("ADMIN"));

// GET /api/users
router.get("/", async (_req, res) => {
  try {
    const users = await getUsersForAdmin();
    res.status(200).json({ users, count: users.length });
  } catch (error) {
    console.error("Listing users failed:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// PATCH /api/users/:id/role
router.patch("/:id/role", async (req, res) => {
  try {
    const input = updateManagedRoleSchema.parse(req.body);
    const user = await changeManagedUserRole(req.params.id as string, input.role);

    res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Invalid role data",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    if (error instanceof UserManagementError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Updating user role failed:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

// PATCH /api/users/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = updateManagedStatusSchema.parse(req.body);

    if (!authReq.auth) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const user = await changeManagedUserActiveStatus(
      req.params.id as string,
      input.isActive,
      authReq.auth.userId,
    );

    res.status(200).json({
      message: "User account status updated successfully",
      user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Invalid account status data",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    if (error instanceof UserManagementError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Updating user status failed:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

export default router;
