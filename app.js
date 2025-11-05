// app.js import dependances
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connexion à la base MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("API SpeakTime opérationnelle ");
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/meetings", meetingRoutes);

export default app;
