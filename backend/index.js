// ✅ Load environment variables before anything else
import 'dotenv/config';

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

// ✅ Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔍 Debug logs
console.log("Running in:", process.env.NODE_ENV);
console.log("Mongo URI:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");
console.log(
  "📨 SendGrid API key loaded:",
  process.env.SENDGRID_API_KEY?.startsWith("SG.") ? "✅ Yes" : "❌ No"
);
console.log("📧 Sender email:", process.env.EMAIL_FROM || "❌ Missing");
console.log("🌐 Client URL:", process.env.CLIENT_URL || "Not set");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// ✅ Connect DB before starting the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("✅ Server is running on port:", PORT);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
  });
