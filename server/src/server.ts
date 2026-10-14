
import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./config/database";
import { ensureUserIndexes } from "./repositories/userRepository";
import { ensureTicketMessageIndexes } from "./repositories/ticketMessageRepository";
import { hasAnyAdmin } from "./repositories/userRepository";
import { ensureSetupState } from "./repositories/setupRepository";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectDatabase();
  await ensureUserIndexes();
  console.log("User collection indexes are ready");

  await ensureSetupState(await hasAnyAdmin());
  console.log("Initial administrator setup state is ready");

  await ensureTicketMessageIndexes();
  console.log("Ticket message collection indexes are ready");

  app.listen(PORT, () => {
    console.log(`River API running on http://localhost:${PORT}`);
  });
}

startServer();
