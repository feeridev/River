
import { findUserByEmail } from "../repositories/userRepository";
import { verifyPassword } from "../utils/password";
import { createAuthToken } from "../utils/token";
import { AuthError } from "./authService";

export async function loginUser(input: {
  email: string;
  password: string;
}) {
  const user = await findUserByEmail(input.email);

  // Use the same error for an unknown email and an incorrect password.
  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new AuthError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AuthError("Account is inactive", 403);
  }

  if (!user._id) {
    throw new Error("User record is missing its database ID");
  }

  const token = createAuthToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
