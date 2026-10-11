
import { hashPassword, verifyPassword } from "../src/utils/password";

async function testPasswordUtility() {
  const password = "River-Test-Password-123!";
  const passwordHash = await hashPassword(password);

  console.log("1. Password is hashed:", passwordHash !== password);
  console.log(
    "2. Correct password is accepted:",
    await verifyPassword(password, passwordHash),
  );
  console.log(
    "3. Incorrect password is rejected:",
    !(await verifyPassword("Wrong-Password!", passwordHash)),
  );
}

testPasswordUtility().catch((error) => {
  console.error("Password test failed:", error);
  process.exitCode = 1;
});
