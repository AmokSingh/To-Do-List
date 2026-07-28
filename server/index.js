import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.js";
import { todoRouter } from "./routes/todo.js";

// Load environment variables
dotenv.config();

// Debug - check if env loaded
console.log("🔑 JWT_SECRET_KEY loaded:", !!process.env.JWT_SECRET_KEY);
console.log("🍃 MONGODB_URI loaded:", !!process.env.MONGODB_URI);

// Set fallback if env not loaded
if (!process.env.JWT_SECRET_KEY) {
  console.log("⚠️ Using fallback JWT secret");
  process.env.JWT_SECRET_KEY = "fallback_dev_secret_12345";
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", async () => {
  console.log("✅ Connected to MongoDB");

  // 🔥 FIX: Ensure correct indexes
  try {
    const collection = mongoose.connection.db.collection("todos");
    const indexes = await collection.indexes();


    // Check if old global index exists
    const hasOldIndex = indexes.some((idx) => idx.name === "todo_1");
    if (hasOldIndex) {
      console.log("🗑️ Dropping old global index 'todo_1'...");
      await collection.dropIndex("todo_1");
    }

    // Check if compound index exists
    const hasCompoundIndex = indexes.some(
      (idx) => idx.name === "userId_1_todo_1",
    );
    if (!hasCompoundIndex) {
      console.log("🔄 Creating compound index { userId: 1, todo: 1 }...");
      await collection.createIndex({ userId: 1, todo: 1 }, { unique: true });
    } 
  } catch (error) {
    console.error("❌ Error managing indexes:", error);
  }
});

db.on("error", (error) => {
  console.error("❌ Error connecting to MongoDB:", error);
});
db.on("disconnected", () => {
  console.log("⚠️ Disconnected from MongoDB");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api", todoRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
