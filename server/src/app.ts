import express from "express";
import path from "node:path";

import authRoutes from "./routes/authRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import userRoutes from "./routes/userRoutes";

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
app.use("/api/users", userRoutes);

// Return JSON for unknown API endpoints instead of the frontend HTML.
app.use("/api", (_req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
  });
});

// In production, serve the compiled React application.
// The installer/build process will place the frontend in server/public.
if (process.env.NODE_ENV === "production") {
  const webRoot = path.resolve(__dirname, "../public");

  app.use(express.static(webRoot));

  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return next();
    }

    res.sendFile(path.join(webRoot, "index.html"), (error) => {
      if (error) {
        next(error);
      }
    });
  });
}

export default app;
