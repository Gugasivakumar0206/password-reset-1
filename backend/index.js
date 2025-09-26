import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

// ✅ Resolve current directory properly in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Force dotenv to load from backend/.env
dotenv.config({ path: path.join(__dirname, ".env") });

// 🔍 Debug logs
console.log("Running in:", process.env.NODE_ENV);
console.log("Mongo URI:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");
console.log("📩 Mailtrap token loaded:", process.env.MAILTRAP_TOKEN ? "✅ Yes" : "❌ No");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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

// ✅ Connect DB before starting server
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log("✅ Server is running on port:", PORT);
	});
});
