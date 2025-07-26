// server/index.ts
import "dotenv/config";

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { isDeepStrictEqual as isEqual } from "node:util";
import { Alert } from "../shared/schema";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// In-memory store for this session
let customAlerts: Alert[] = [];

// ── Logging middleware ───────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;
  const originalJson = res.json;
  res.json = function (body, ...args) {
    capturedJsonResponse = body;
    return originalJson.apply(res, [body, ...args]);
  };
  res.on("finish", () => {
    if (path.startsWith("/api")) {
      let line = `${req.method} ${path} ${res.statusCode} in ${Date.now() - start}ms`;
      if (capturedJsonResponse) {
        line += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(line.length > 80 ? line.slice(0, 79) + "…" : line);
    }
  });
  next();
});

// ── Custom-Alerts Endpoints (no DB) ──────────────────────────────────────────
// GET all configured alerts
app.get("/api/customAlerts", (_req: Request, res: Response) => {
  res.json(customAlerts);
});

// POST a new alert, dedupe in-memory
app.post("/api/customAlerts", (req: Request, res: Response) => {
  const newAlert = req.body as Alert;
  if (customAlerts.some((a) => isEqual(a, newAlert))) {
    return res.status(409).json({ message: "This alert is already configured." });
  }
  customAlerts.push(newAlert);
  return res.json(customAlerts);
});

// ── Register your other routes, Vite, and error handling ────────────────────
;(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT) || 5000;
  server.listen({ port, host: "0.0.0.0", reusePort: true }, () =>
    log(`serving on port ${port}`)
  );
})();

