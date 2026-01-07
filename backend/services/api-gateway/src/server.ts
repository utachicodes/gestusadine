import "./config-env.js"; // Initialize environment first
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "child_process";
import path from "node:path";
import express from "express";
import cors from "cors";
import { translationServiceManager } from "./translation-service-manager.js";
import { requireAdmin, requireAuth } from "./auth";
import { configService } from "../../config-service/config.service";
import { documentManager } from "../../rag-service/document-manager";

// Get project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// In Render and Docker, the project root is usually the CWD
const projectRoot = process.env.RENDER || process.env.DOCKER ? process.cwd() : resolve(__dirname, "../../../../");

console.log("🚀 Starting XamSaDine API Gateway");
console.log("  __dirname:", __dirname);
console.log("  cwd:", process.cwd());
console.log("  projectRoot:", projectRoot);

// Log directory structure to debug missing dist
try {
  console.log("📂 Root Directory Contents:");
  const files = readdirSync(projectRoot);
  files.forEach(file => {
    const isDir = existsSync(path.join(projectRoot, file)) && !file.includes('.');
    console.log(`  ${isDir ? '📁' : '📄'} ${file}`);
  });
} catch (e: any) {
  console.error("⚠️  Failed to list directory contents:", e.message);
}

// Import routes after env is loaded
const { postFatwa } = await import("./routes/fatwa.ts");
const { getDaily } = await import("./routes/daily.ts");
const libraryRoutesModule = await import("./routes/library.js");
const libraryRoutes = libraryRoutesModule.default;
import chatRoutes from "./chat.js";
import { videoRoutes } from "../../video-service/src/routes/video.routes.js";
import { eventRoutes } from "../../event-service/src/routes/event.routes.js";
import { commerceRoutes } from "../../commerce-service/src/routes/commerce.routes.js"; // Direct import for monolith
import { tarteelRoutes } from "./routes/tarteel.ts";
import { councilRoutes } from "./routes/council.routes.js";

// Catch unhandled promise rejections
process.on("unhandledRejection", (reason: any, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});

const app = express();

// Security: Configure CORS properly
const corsOptions = {
  origin: process.env.FRONTEND_URL || process.env.VITE_API_URL || 'http://localhost:8080',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Security: Limit request body size
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Dynamic search for dist folder up the tree
function findDistFolder(startDir: string): string | null {
  let currentDir = startDir;
  const root = resolve("/");

  while (currentDir !== root) {
    const distPath = resolve(currentDir, "dist");
    const indexHtml = resolve(distPath, "index.html");

    if (existsSync(distPath)) {
      console.log(`  Found dist folder at: ${distPath}`);
      if (existsSync(indexHtml)) {
        return distPath;
      } else {
        console.log(`  ⚠️  dist exists but index.html is missing inside it! Contents:`, readdirSync(distPath).join(', '));
      }
    }

    const parent = dirname(currentDir);
    if (parent === currentDir) break; // Reached root or same level
    currentDir = parent;
  }
  return null;
}

console.log("🌍 Deployment Debug Info:");
console.log("  RENDER_ENV:", !!process.env.RENDER);
console.log("  NODE_ENV:", process.env.NODE_ENV);
console.log("  PORT:", process.env.PORT);
console.log("  SUPABASE_URL Set:", !!process.env.SUPABASE_URL || !!process.env.VITE_SUPABASE_URL);
console.log("  __dirname:", __dirname);
console.log("  cwd:", process.cwd());

const isProduction = process.env.NODE_ENV === "production";
let distPath: string | null = null;

if (isProduction) {
  distPath = findDistFolder(__dirname) || findDistFolder(process.cwd());

  if (!distPath) {
    console.warn("⚠️  dist not found. Attempting to build frontend with `npm run build`...");
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    const result = spawnSync(npmCmd, ["run", "build"], {
      cwd: projectRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    if (result.status === 0) {
      distPath = findDistFolder(projectRoot) || findDistFolder(process.cwd());
    } else {
      console.error("❌ Frontend build failed. See logs above.");
    }
  }

  if (distPath) {
    console.log("✅ Serving static files from:", distPath);
    app.use(express.static(distPath));
  } else {
    console.error("❌ CRITICAL: dist directory or index.html not found even after build attempt!");
  }
} else {
  console.log("ℹ️  Development mode: not serving static dist. Use Vite dev server for frontend.");
}

const indexHtmlPath = distPath ? path.join(distPath, "index.html") : "";
const fallbackIndexHtmlPath = path.join(projectRoot, "index.html");

// Initialize services
// Initialize services
app.use('/api/tarteel', tarteelRoutes);
app.use('/api/council', councilRoutes);


configService.loadConfig().then(() => {
  console.log('✅ Config service initialized');
}).catch((err: any) => {
  console.error('⚠️  Config service error:', err.message);
});

documentManager.init().then(() => {
  console.log('✅ Document manager initialized');
}).catch((err: any) => {
  console.error('⚠️  Document manager error:', err.message);
});

// Simple test endpoint
app.get("/", (_req, res) => {
  if (distPath && existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
    return;
  }

  if (existsSync(fallbackIndexHtmlPath)) {
    res.sendFile(fallbackIndexHtmlPath);
    return;
  }

  res.json({ message: "XamSaDine API Gateway is running!", status: "ok" });
});

// Test endpoint for fatwa
app.get("/api/fatwa/test", (_req, res) => {
  res.json({
    message: "Fatwa endpoint is accessible",
    timestamp: new Date().toISOString()
  });
});

// Deployment Debug Endpoint
app.get("/api/debug/deployment", (_req, res) => {
  res.json({
    render: !!process.env.RENDER,
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd(),
    dirname: __dirname,
    distPath: distPath || "NOT_FOUND",
    indexHtmlExists: !!distPath && existsSync(indexHtmlPath),
    projectRoot: typeof projectRoot !== 'undefined' ? projectRoot : "UNKNOWN"
  });
});

app.post("/api/fatwa", async (req, res) => {
  try {
    console.log("📨 POST /api/fatwa - Request received");
    await postFatwa(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/fatwa route:", error);
    console.error("   Error type:", error?.constructor?.name);
    console.error("   Error message:", error?.message || error);
    console.error("   Stack:", error?.stack);
    if (!res.headersSent) {
      try {
        res.status(500).json({
          error: "Internal server error",
          message: error?.message || "An unexpected error occurred",
        });
      } catch (responseError) {
        console.error("💥 Could not send error response:", responseError);
      }
    }
  }
});


app.get("/api/daily", async (req, res) => {
  try {
    await getDaily(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/daily route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }
});

app.post("/api/ask", async (req, res) => {
  try {
    const { askCircle } = await import("./routes/circle.ts");
    await askCircle(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/ask route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }
});



// Config routes
app.get("/api/config/agents", requireAdmin, async (req, res) => {
  try {
    const { getAgents } = await import("./routes/config.ts");
    await getAgents(req, res);
  } catch (error: any) {
    console.error("💥 Error in /api/config/agents:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});

app.post("/api/config/agents/:agentId", requireAdmin, async (req, res) => {
  try {
    const { updateAgent } = await import("./routes/config.ts");
    await updateAgent(req, res);
  } catch (error: any) {
    console.error("💥 Error in /api/config/agents/:agentId:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});

app.get("/api/config/models", requireAdmin, async (req, res) => {
  try {
    const { getModels } = await import("./routes/config.ts");
    await getModels(req, res);
  } catch (error: any) {
    console.error("💥 Error in /api/config/models:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});

// Document routes
app.post("/api/documents/upload", requireAdmin, async (req, res) => {
  try {
    const { uploadMiddleware, uploadDocument } = await import("./routes/documents.ts");
    uploadMiddleware(req, res, async (err: any) => {
      if (err) {
        res.status(500).json({ error: "Upload failed", message: err.message });
        return;
      }
      await uploadDocument(req, res);
    });
  } catch (error: any) {
    console.error("💥 Error in /api/documents/upload:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});

app.get("/api/documents", requireAdmin, async (req, res) => {
  try {
    const { listDocuments } = await import("./routes/documents.ts");
    await listDocuments(req, res);
  } catch (error: any) {
    console.error("💥 Error in /api/documents:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});

app.delete("/api/documents/:id", requireAdmin, async (req, res) => {
  try {
    const { deleteDocument } = await import("./routes/documents.ts");
    await deleteDocument(req, res);
  } catch (error: any) {
    console.error("💥 Error in /api/documents/:id:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});

app.get("/api/documents/:id/url", requireAdmin, async (req, res) => {
  try {
    const { getDocumentSignedUrl } = await import("./routes/documents.ts");
    await getDocumentSignedUrl(req, res);
  } catch (error: any) {
    console.error("💥 Error in /api/documents/:id/url:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});



// Chat routes
app.use('/api', chatRoutes);

// Video Service routes
app.use('/api/media/video', videoRoutes);

// Event Service routes
app.use('/api/events', eventRoutes);

// Commerce Service routes
app.use('/api/shop', commerceRoutes);

// Library Service routes
app.use('/api/library', libraryRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    res.status(404).json({ error: "Not Found" });
    return;
  }

  if (distPath && existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
    return;
  }

  if (existsSync(fallbackIndexHtmlPath)) {
    res.sendFile(fallbackIndexHtmlPath);
    return;
  }

  res.status(404).json({ error: "Not Found" });
});


const port = process.env.PORT || 4000;

const server = app.listen(port, async () => {
  try {
    // Start translation service
    await translationServiceManager.start();

    console.log(`✅ api-gateway listening on http://localhost:${port}`);
    console.log(`✅ Test: http://localhost:${port}/health`);
  } catch (error: any) {
    console.error("⚠️  Warning: Translation service failed to start:", error.message);
    console.log("   API Gateway will continue to run without translation service");
  }
}).on("error", (error: any) => {
  console.error("💥 FATAL: Could not start server:", error);
  process.exit(1);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down...");
  translationServiceManager.stop();
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
