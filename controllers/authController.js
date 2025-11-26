import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// Fonction de validation
const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  // Minimum 8 caractères, maximum 50
  // Doit contenir : au moins 1 lettre, 1 chiffre, 1 caractère spécial
  // PAS d'espace autorisé
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNoSpace = !/\s/.test(password);

  return (
    password &&
    password.length >= 8 &&
    password.length <= 50 &&
    hasLetter &&
    hasDigit &&
    hasSpecialChar &&
    hasNoSpace
  );
};

const validateUsername = (username) => {
  // 3-20 caractères, alphanumériques + tiret + underscore
  return (
    username &&
    username.length >= 3 &&
    username.length <= 20 &&
    /^[a-zA-Z0-9_-]+$/.test(username)
  );
};

// Fonction utilitaire pour générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Inscription
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation des champs
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Validation de l'email
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Format d'email invalide." });
    }

    // Validation du username
    if (!validateUsername(username)) {
      return res.status(400).json({
        message:
          "Le pseudo doit contenir 3-20 caractères (alphanumériques, tiret, underscore).",
      });
    }

    // Validation du password
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          'Le mot de passe doit contenir entre 8 et 50 caractères, au moins 1 lettre, 1 chiffre, 1 caractère spécial (!@#$%^&*(),.?":{}|<>) et aucun espace.',
      });
    }

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Cet email est déjà utilisé." });

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crée le nouvel utilisateur
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Compte créé avec succès !" });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Connexion
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    // Validation de l'email
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Format d'email invalide." });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Identifiants invalides." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Identifiants invalides." });

    // Crée un token JWT
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Refresh token - Génère un nouveau token JWT
export const refreshToken = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Token invalide ou expiré." });
    }

    // Génère un nouveau token
    const newToken = generateToken(userId);

    res.status(200).json({
      message: "Token actualisé avec succès",
      token: newToken,
    });
  } catch (error) {
    console.error("Erreur lors de l'actualisation du token :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
