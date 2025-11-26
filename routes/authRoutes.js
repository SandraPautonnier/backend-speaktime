import express from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  refreshToken,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rate limiting pour login (5 tentatives par 15 minutes par IP)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 requêtes
  message:
    "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "development", // Désactiver en développement
});

// Rate limiting pour register (3 comptes par heure par IP)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Maximum 3 comptes
  message:
    "Trop de tentatives d'inscription. Veuillez réessayer dans une heure.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "development", // Désactiver en développement
});

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/refresh", protect, refreshToken);

// Route de test pour vérifier que les routes auth fonctionnent
router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Routes authentification fonctionnelles ✅",
    routes: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/auth/refresh (protégée)",
      "GET /api/auth/test",
    ],
  });
});

export default router;
