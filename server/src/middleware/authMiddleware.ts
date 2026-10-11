
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { findUserById } from "../repositories/userRepository";
import type { AuthTokenPayload } from "../utils/token";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

export interface AuthenticatedRequest extends Request {
  auth?: AuthTokenPayload;
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication token required" });
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json({ message: "Authentication token required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      issuer: "river-api",
      audience: "river-app",
    });

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "string" ||
      !ObjectId.isValid(decoded.userId)
    ) {
      res.status(401).json({ message: "Invalid authentication token" });
      return;
    }

    const user = await findUserById(decoded.userId);

    if (!user || !user.isActive || !user._id) {
      res.status(401).json({ message: "Account is unavailable" });
      return;
    }

    req.auth = {
      userId: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: "Invalid or expired authentication token",
      });
      return;
    }

    console.error("Authentication failed:", error);
    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
}
