import express from "express";
import authRoutes from "./routes/authRoutes";
import ticketRoutes from "./routes/ticketRoutes";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "River API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

export default app;