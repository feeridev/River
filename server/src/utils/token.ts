
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

export interface AuthTokenPayload {
  userId: string;
  role: "EMPLOYEE" | "AGENT" | "ADMIN";
}

export function createAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: 3600,
    issuer: "river-api",
    audience: "river-app",
  });
}
