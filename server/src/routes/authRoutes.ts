
import { Router } from "express";
import { ZodError } from "zod";
import {
  registerSchema,
  loginSchema,
} from "../validation/authValidation";
import {
  AuthError,
  registerUser,
} from "../services/authService";
import { loginUser } from "../services/loginService";
import { authenticateToken } from "../middleware/authMiddleware";
import type { AuthenticatedRequest } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const input = registerSchema.parse(req.body);
    const user = await registerUser(input);

    res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Invalid registration data",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return;
    }

    console.error("Registration failed:", error);
    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Invalid login data",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return;
    }

    console.error("Login failed:", error);
    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
});

router.get(
  "/me",
  authenticateToken,
  async (req, res) => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;

      res.status(200).json({
        user: authenticatedReq.auth,
      });
    } catch (error) {
      console.error("Fetching current user failed:", error);
      res.status(500).json({
        message: "An unexpected error occurred",
      });
    }
  },
);

export default router;
